import base64

import modal


MODEL_VOLUME_NAME = "gc-models"
MODEL_MOUNT_PATH = "/models"

model_volume = modal.Volume.from_name(MODEL_VOLUME_NAME, create_if_missing=True)

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install(
    "libglib2.0-0",
    "libgl1",
    )
    .pip_install_from_requirements("requirements.txt")
    .add_local_dir("inference", remote_path="/root/inference")
    .add_local_dir("config", remote_path="/root/config")
)

app = modal.App("gc-inference")


@app.cls(
    image=image,
    gpu="any",
    timeout=300,
    volumes={MODEL_MOUNT_PATH: model_volume},
)
class GarbageClassifier:
    @modal.enter()
    def load(self):
        from inference.model_registry import ModelRegistry

        self.registry = ModelRegistry()

    @modal.method()
    def predict_batch(self, payload):
        job_id = payload.get("job_id")
        model_type = payload.get("model_type")
        images = payload.get("images", [])

        if not job_id:
            raise ValueError("job_id is required.")

        if model_type not in ["ssd", "yolo", "faster_rcnn"]:
            raise ValueError(
                "model_type must be one of: ssd, yolo, faster_rcnn."
            )

        if not images:
            raise ValueError("images list is required.")

        model = self.registry.get_model(model_type)

        results = []

        for item in images:
            image_path = item.get("image_path")
            image_base64 = item.get("image_base64")
            timestamp_seconds = item.get("timestamp_seconds")

            if not image_path:
                raise ValueError("Each image item must include image_path.")

            if not image_base64:
                raise ValueError(f"Missing image_base64 for image: {image_path}")

            image_bytes = base64.b64decode(image_base64)

            prediction = model.predict_bytes(image_bytes)

            detections = prediction["detections"]

            result = {
                "image_path": image_path,
                "image_width": prediction["image_width"],
                "image_height": prediction["image_height"],
                "detections": detections,
            }

            if timestamp_seconds is not None:
                result["timestamp_seconds"] = timestamp_seconds

            results.append(result)

        return {
            "job_id": job_id,
            "model_type": model_type,
            "results": results,
        }


@app.function(image=image)
@modal.fastapi_endpoint(method="POST")
async def infer(payload: dict):
    classifier = GarbageClassifier()
    return await classifier.predict_batch.remote.aio(payload)
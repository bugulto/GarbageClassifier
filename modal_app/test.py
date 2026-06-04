import base64
import argparse
import json
from pathlib import Path

import requests


MODAL_ENDPOINT_URL = "https://lamichhaneprabal--gc-inference-infer.modal.run"
MODEL_TYPES = [ "yolo", "faster_rcnn", "ssd" ]


def encode_image_to_base64(image_path):
    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def test_modal_endpoint(image_path, model_type):
    image_base64 = encode_image_to_base64(image_path)

    payload = {
        "job_id": "test_job_001",
        "model_type": model_type,
        "images": [
            {
                "image_path": str(image_path),
                "image_base64": image_base64,
                "timestamp_seconds": 0.0,
            }
        ],
    }

    response = requests.post(
        MODAL_ENDPOINT_URL,
        json=payload,
        timeout=300,
    )

    print("Status Code:", response.status_code)

    try:
        data = response.json()
        print(json.dumps(data, indent=2))
    except Exception:
        print(response.text)

    response.raise_for_status()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--image-path", default="/home/alaxini/projects/GarbageClassifier/test/metal32_jpg.rf.ec6b4bac450c6e7b73b32ece688c49dc.jpg")
    parser.add_argument("--model-type", choices=MODEL_TYPES)
    parser.add_argument("--all-models", action="store_true")
    args = parser.parse_args()

    if args.all_models:
        for model_type in MODEL_TYPES:
            print(f"\nTesting model_type={model_type}")
            test_modal_endpoint(
                image_path=args.image_path,
                model_type=model_type,
            )
    else:
        if not args.model_type:
            raise SystemExit("Use --model-type or --all-models.")

        test_modal_endpoint(
            image_path=args.image_path,
            model_type=args.model_type,
        )
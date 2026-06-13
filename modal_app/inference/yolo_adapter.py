import io

from PIL import Image
from ultralytics import YOLO


class YOLOAdapter:
    def __init__(
        self,
        weights_path,
        score_threshold=0.3,
        iou_threshold=0.3,
        img_size=640,
    ):
        self.weights_path = weights_path
        self.score_threshold = score_threshold
        self.iou_threshold = iou_threshold
        self.img_size = img_size

        self.model = YOLO(self.weights_path)

    def predict_bytes(self, image_bytes):
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_width, image_height = image.size

        results = self.model.predict(
            source=image,
            imgsz=self.img_size,
            conf=self.score_threshold,
            iou=self.iou_threshold,
            verbose=False,
        )

        detections = []

        for result in results:
            boxes = result.boxes

            if boxes is None:
                continue

            xyxy = boxes.xyxy.cpu().numpy()
            confidences = boxes.conf.cpu().numpy()
            class_ids = boxes.cls.cpu().numpy()

            for box, confidence, class_id in zip(xyxy, confidences, class_ids):
                raw_class_id = int(class_id)

                x1, y1, x2, y2 = [float(value) for value in box]

                class_name = self.model.names.get(raw_class_id, "unknown")

                detections.append(
                    {
                        "class_name": class_name,
                        "class_id": raw_class_id + 1,
                        "confidence": float(confidence),
                        "bbox": {
                            "x1": x1,
                            "y1": y1,
                            "x2": x2,
                            "y2": y2,
                        },
                    }
                )

        return {
            "image_width": image_width,
            "image_height": image_height,
            "detections": detections,
        }
import io
import os

import torch
import torchvision
from PIL import Image
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision.transforms import functional as F


class FRCNNAdapter:
    def __init__(
        self,
        weights_path,
        class_names,
        img_size=640,
        score_threshold=0.3,
        iou_threshold=0.3,
        device=None,
    ):
        self.weights_path = weights_path
        self.class_names = class_names
        self.img_size = img_size
        self.score_threshold = score_threshold
        self.iou_threshold = iou_threshold
        self.device = device or torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        self.model = self._load_model()
        self.model.eval()

    def _load_checkpoint(self):
        checkpoint = torch.load(self.weights_path, map_location=self.device)

        if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
            return checkpoint["model_state_dict"]

        return checkpoint

    def _load_model(self):
        if not os.path.isfile(self.weights_path):
            raise FileNotFoundError(
                f"Faster R-CNN weights not found: {self.weights_path}"
            )

        num_classes = len(self.class_names) + 1

        model = torchvision.models.detection.fasterrcnn_resnet50_fpn_v2(
            weights=None
        )

        in_features = model.roi_heads.box_predictor.cls_score.in_features
        model.roi_heads.box_predictor = FastRCNNPredictor(
            in_features,
            num_classes,
        )

        model.load_state_dict(self._load_checkpoint())
        model.to(self.device)

        return model

    def _letterbox(self, image):
        original_width, original_height = image.size

        scale = min(
            self.img_size / original_width,
            self.img_size / original_height,
        )

        resized_width = int(round(original_width * scale))
        resized_height = int(round(original_height * scale))

        resized_image = image.resize(
            (resized_width, resized_height),
            Image.BILINEAR,
        )

        padded_image = Image.new(
            "RGB",
            (self.img_size, self.img_size),
            (114, 114, 114),
        )

        pad_x = (self.img_size - resized_width) // 2
        pad_y = (self.img_size - resized_height) // 2

        padded_image.paste(resized_image, (pad_x, pad_y))

        return padded_image, scale, pad_x, pad_y

    def _scale_box_back_to_original(
        self,
        box,
        scale,
        pad_x,
        pad_y,
        original_width,
        original_height,
    ):
        x1, y1, x2, y2 = [float(value) for value in box]

        x1 = (x1 - pad_x) / scale
        x2 = (x2 - pad_x) / scale
        y1 = (y1 - pad_y) / scale
        y2 = (y2 - pad_y) / scale

        x1 = max(0.0, min(x1, original_width))
        x2 = max(0.0, min(x2, original_width))
        y1 = max(0.0, min(y1, original_height))
        y2 = max(0.0, min(y2, original_height))

        return x1, y1, x2, y2

    def predict_bytes(self, image_bytes):
        original_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        original_width, original_height = original_image.size

        processed_image, scale, pad_x, pad_y = self._letterbox(original_image)

        image_tensor = F.to_tensor(processed_image).to(self.device)

        with torch.no_grad():
            prediction = self.model([image_tensor])[0]

        boxes = prediction["boxes"]
        labels = prediction["labels"]
        scores = prediction["scores"]

        keep = scores >= self.score_threshold

        boxes = boxes[keep]
        labels = labels[keep]
        scores = scores[keep]

        if boxes.numel() > 0:
            nms_indices = torchvision.ops.nms(
                boxes,
                scores,
                self.iou_threshold,
            )

            boxes = boxes[nms_indices]
            labels = labels[nms_indices]
            scores = scores[nms_indices]

        detections = []

        for box, label, score in zip(
            boxes.cpu().numpy(),
            labels.cpu().numpy(),
            scores.cpu().numpy(),
        ):
            class_id = int(label)

            if class_id <= 0 or class_id - 1 >= len(self.class_names):
                continue

            x1, y1, x2, y2 = self._scale_box_back_to_original(
                box=box,
                scale=scale,
                pad_x=pad_x,
                pad_y=pad_y,
                original_width=original_width,
                original_height=original_height,
            )

            detections.append(
                {
                    "class_name": self.class_names[class_id - 1],
                    "class_id": class_id,
                    "confidence": float(score),
                    "bbox": {
                        "x1": x1,
                        "y1": y1,
                        "x2": x2,
                        "y2": y2,
                    },
                }
            )

        return {
            "image_width": original_width,
            "image_height": original_height,
            "detections": detections,
        }
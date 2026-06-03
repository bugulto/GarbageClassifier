import io
import os

import torch
import torchvision
from PIL import Image
from torchvision.models.detection import SSD300_VGG16_Weights, ssd300_vgg16
from torchvision.models.detection.ssd import SSDClassificationHead
from torchvision.transforms import functional as F


class SSDAdapter:
    def __init__(
        self,
        weights_path,
        class_names,
        img_size=300,
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

    def _build_ssd_model(self, num_classes):
        weights = SSD300_VGG16_Weights.DEFAULT
        model = ssd300_vgg16(weights=weights)

        if hasattr(model.head.classification_head, "in_channels"):
            in_channels = model.head.classification_head.in_channels
        else:
            in_channels = [512, 1024, 512, 256, 256, 256]

        num_anchors = model.anchor_generator.num_anchors_per_location()

        model.head.classification_head = SSDClassificationHead(
            in_channels=in_channels,
            num_anchors=num_anchors,
            num_classes=num_classes,
        )

        return model

    def _load_checkpoint(self):
        checkpoint = torch.load(self.weights_path, map_location=self.device)

        if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
            return checkpoint["model_state_dict"]

        return checkpoint

    def _load_model(self):
        if not os.path.isfile(self.weights_path):
            raise FileNotFoundError(f"SSD weights not found: {self.weights_path}")

        num_classes = len(self.class_names) + 1

        model = self._build_ssd_model(num_classes)
        model.load_state_dict(self._load_checkpoint())
        model.to(self.device)

        return model

    def predict_bytes(self, image_bytes):
        original_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        original_width, original_height = original_image.size

        resized_image = original_image.resize((self.img_size, self.img_size))
        image_tensor = F.to_tensor(resized_image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            prediction = self.model(image_tensor)[0]

        scores = prediction["scores"]
        keep = scores >= self.score_threshold

        boxes = prediction["boxes"][keep]
        labels = prediction["labels"][keep]
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

        if boxes.numel() > 0:
            scale_x = original_width / self.img_size
            scale_y = original_height / self.img_size

            boxes[:, 0] *= scale_x
            boxes[:, 2] *= scale_x
            boxes[:, 1] *= scale_y
            boxes[:, 3] *= scale_y

        detections = []

        for box, label, score in zip(
            boxes.cpu().numpy(),
            labels.cpu().numpy(),
            scores.cpu().numpy(),
        ):
            class_id = int(label)

            if class_id <= 0 or class_id - 1 >= len(self.class_names):
                continue

            x1, y1, x2, y2 = [float(value) for value in box]

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
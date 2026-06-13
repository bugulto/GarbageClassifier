from inference.ssd_adapter import SSDAdapter
from inference.yolo_adapter import YOLOAdapter
from inference.frcnn_adapter import FRCNNAdapter


SSD_WEIGHTS_PATH = "/models/ssd/ssd_garbage_best.pth"
YOLO_WEIGHTS_PATH = "/models/yolo/YoloGC.pt"
FRCNN_WEIGHTS_PATH = "/models/fasterrcnn/Fasterrcnn_bestmodel.pth"


class ModelRegistry:
    def __init__(self):
        self.models = {}

    def get_model(self, model_type):
        if model_type not in self.models:
            self.models[model_type] = self._load_model(model_type)

        return self.models[model_type]

    def _load_model(self, model_type):
        from config.class_names import CLASS_NAMES

        if model_type == "ssd":
            return SSDAdapter(
                weights_path=SSD_WEIGHTS_PATH,
                class_names=CLASS_NAMES,
                img_size=300,
                score_threshold=0.3,
                iou_threshold=0.3,
            )

        if model_type == "yolo":
            return YOLOAdapter(
                weights_path=YOLO_WEIGHTS_PATH,
                score_threshold=0.3,
                iou_threshold=0.3,
                img_size=640,
            )

        if model_type == "faster_rcnn":
            return FRCNNAdapter(
                weights_path=FRCNN_WEIGHTS_PATH,
                class_names=CLASS_NAMES,
                img_size=640,
                score_threshold=0.3,
                iou_threshold=0.3,
            )

        raise ValueError(f"Unsupported model_type: {model_type}")
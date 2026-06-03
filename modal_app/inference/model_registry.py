from inference.ssd_adapter import SSDAdapter


class ModelRegistry:
    def __init__(self):
        self.models = {}

    def get_model(self, model_type):
        if model_type not in self.models:
            self.models[model_type] = self._load_model(model_type)

        return self.models[model_type]

    def _load_model(self, model_type):
        if model_type == "ssd":
            from config.class_names import CLASS_NAMES

            return SSDAdapter(
                weights_path="/models/ssd/ssd_garbage_best.pth",
                class_names=CLASS_NAMES,
                img_size=300,
                score_threshold=0.3,
                iou_threshold=0.3,
            )

        raise ValueError(f"Unsupported model_type: {model_type}")
import os
from pathlib import Path

from preprocessing.common import RCNNPreprocessor, YoloPreprocessor
from services.inference.adapters.yolo_adapter import YOLO_Inference
from services.inference.adapters.frcnn_adapter import FRCNN_Inference
from services.inference.service import inferenceService

def build_inference_service(model_name, config, project_root):
    model_config = config["models"][model_name]

    if model_name == "yolo_gc":
        preprocessor = YoloPreprocessor(
            input_size=config["preprocessing"]["input_size"],
            roi=config["preprocessing"]["roi"],
        )

        adapter = YOLO_Inference(
            model_path = os.path.join(project_root, model_config["weights"]),
            tracker_path = os.path.join(project_root, model_config["tracker"])
        )

    elif model_name == "FRCNN_gc":
        preprocessor = RCNNPreprocessor(
            input_size=config["preprocessing"]["input_size"],
            roi=config["preprocessing"]["roi"],
        )
        adapter = FRCNN_Inference(
            model_path = os.path.join(project_root, model_config["weights"])
        )

    return inferenceService(adapter, preprocessor)
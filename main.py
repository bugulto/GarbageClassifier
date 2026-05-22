import os
import cv2
import yaml

from ingestion.sampler import sampling
from ingestion.video_source import video_source
from services.inference.registry import build_inference_service


def load_config(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

script_dir = os.path.dirname(os.path.abspath(__file__))

def main():
    config_path = os.path.join(script_dir, "config", "config.yaml")
    config = load_config(config_path)
            
    cap = video_source(config["video"], project_root=script_dir)

    inference_service = build_inference_service(
        model_name=config["pipeline"]["model"],
        config=config,
        project_root=script_dir,
    )
    
    for frames in sampling(cap, config):
        predictions = inference_service.predict(frames)
        print("Current Counts:", predictions)



if __name__ == "__main__":
    main()
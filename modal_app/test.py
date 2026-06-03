import base64
import json
import mimetypes
from pathlib import Path

import requests


MODAL_ENDPOINT_URL = "https://lamichhaneprabal--gc-inference-infer-dev.modal.run/"


def encode_image_to_base64(image_path):
    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def test_modal_endpoint(image_path, model_type="ssd"):
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
    test_image_path = "/home/alaxini/projects/garb_class/GARBAGE CLASSIFICATION/test/images/metal29_jpg.rf.5cadc019ff77d286f7a7b0e9affd13df.jpg"

    test_modal_endpoint(
        image_path=test_image_path,
        model_type="ssd",
    )
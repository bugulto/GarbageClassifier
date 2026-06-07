import base64
import os

from django.conf import settings

from .modal_client import call_modal_inference


def encode_media_file_to_base64(relative_path):
    """
    Converts a file inside MEDIA_ROOT to base64.
    relative_path example:
    images/job_id/original.jpg
    snapshots/job_id/frame_000000_t0.00.jpg
    """

    full_path = os.path.join(settings.MEDIA_ROOT, relative_path)

    if not os.path.isfile(full_path):
        raise FileNotFoundError(f"Media file not found: {full_path}")

    with open(full_path, "rb") as file:
        return base64.b64encode(file.read()).decode("utf-8")


def build_image_payload(job_id, model_type, image_path):
    """
    Builds Modal payload for a single image upload.
    """

    return {
        "job_id": job_id,
        "model_type": model_type,
        "images": [
            {
                "image_path": image_path,
                "image_base64": encode_media_file_to_base64(image_path),
                "timestamp_seconds": None,
            }
        ],
    }


def build_video_payload(job_id, model_type, snapshots):
    """
    Builds Modal payload for video snapshots.
    """

    images = []

    for snapshot in snapshots:
        snapshot_path = snapshot["snapshot_path"]

        images.append(
            {
                "image_path": snapshot_path,
                "image_base64": encode_media_file_to_base64(snapshot_path),
                "timestamp_seconds": snapshot.get("timestamp_seconds"),
            }
        )

    return {
        "job_id": job_id,
        "model_type": model_type,
        "images": images,
    }


def run_image_inference(job_id, model_type, image_path):
    """
    Runs Modal inference for a single image.
    """

    payload = build_image_payload(
        job_id=job_id,
        model_type=model_type,
        image_path=image_path,
    )

    return call_modal_inference(payload)


def run_video_inference(job_id, model_type, snapshots):
    """
    Runs Modal inference for all extracted video snapshots.
    """

    payload = build_video_payload(
        job_id=job_id,
        model_type=model_type,
        snapshots=snapshots,
    )

    return call_modal_inference(payload)
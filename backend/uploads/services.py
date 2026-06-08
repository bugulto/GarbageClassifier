import os
import uuid

from django.conf import settings
from django.core.files.storage import default_storage

from rest_framework import status
from rest_framework.response import Response


VALID_INPUT_TYPES = ("image", "video")
VALID_MODEL_TYPES = ("yolo", "faster_rcnn", "ssd")


def validate_upload_request(request):
    uploaded_file = request.FILES.get("file")
    input_type = request.data.get("input_type")
    model_type = request.data.get("model_type")

    # --- Basic field checks ---

    if not uploaded_file:
        return None, Response(
            {"error": "No file uploaded."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if input_type not in VALID_INPUT_TYPES:
        return None, Response(
            {"error": "Invalid input_type. Must be image or video."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if model_type not in VALID_MODEL_TYPES:
        return None, Response(
            {"error": "Invalid model_type."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    params = {
        "uploaded_file": uploaded_file,
        "input_type": input_type,
        "model_type": model_type,
    }

    if input_type == "video":
        video_params, error_response = _validate_video_params(request)

        if error_response:
            return None, error_response

        params.update(video_params)

    return params, None


def _validate_video_params(request):
    interval_seconds = request.data.get("interval_seconds")
    crop_x = request.data.get("crop_x")
    crop_y = request.data.get("crop_y")
    crop_width = request.data.get("crop_width")
    crop_height = request.data.get("crop_height")

    if not interval_seconds:
        return None, Response(
            {"error": "interval_seconds is required for video."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if (
        crop_x is None
        or crop_y is None
        or crop_width is None
        or crop_height is None
    ):
        return None, Response(
            {"error": "Crop coordinates are required for video."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        interval_seconds = float(interval_seconds)

        crop = {
            "x": int(float(crop_x)),
            "y": int(float(crop_y)),
            "width": int(float(crop_width)),
            "height": int(float(crop_height)),
        }
    except (TypeError, ValueError):
        return None, Response(
            {"error": "Invalid video parameters."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return {
        "interval_seconds": interval_seconds,
        "crop": crop,
    }, None


def generate_job_id():
    return uuid.uuid4().hex


def save_uploaded_file(uploaded_file, input_type, job_id):
    original_filename = uploaded_file.name

    _, file_extension = os.path.splitext(original_filename)
    file_extension = file_extension or ""

    folder = "images" if input_type == "image" else "videos"
    file_path = f"{folder}/{job_id}/original{file_extension}"

    saved_path = default_storage.save(file_path, uploaded_file)

    return saved_path, original_filename


def build_base_response(request, job_id, input_type, model_type, saved_path, original_filename):

    file_url = request.build_absolute_uri(default_storage.url(saved_path))

    return {
        "message": "File uploaded successfully.",
        "job_id": job_id,
        "input_type": input_type,
        "model_type": model_type,
        "file_path": saved_path,
        "file_url": file_url,
        "original_filename": original_filename,
    }


def build_snapshot_urls(request, raw_snapshots):

    snapshots = []

    for snapshot in raw_snapshots:
        snapshot_url = request.build_absolute_uri(
            default_storage.url(snapshot["snapshot_path"])
        )

        snapshots.append({
            **snapshot,
            "snapshot_url": snapshot_url,
        })

    return snapshots


def build_video_metadata(video_result):

    return {
        "fps": video_result["fps"],
        "total_frames": video_result["total_frames"],
        "duration_seconds": video_result["duration_seconds"],
        "video_width": video_result["video_width"],
        "video_height": video_result["video_height"],
        "frame_interval": video_result["frame_interval"],
    }

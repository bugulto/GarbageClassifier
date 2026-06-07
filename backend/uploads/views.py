import os
import uuid

from django.conf import settings
from django.core.files.storage import default_storage

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from inference.modal_client import ModalInferenceError
from inference.services import run_image_inference, run_video_inference
from preprocessing.video_processor import extract_snapshots_from_video


class UploadView(APIView):
    def post(self, request):
        uploaded_file = request.FILES.get("file")
        input_type = request.data.get("input_type")
        model_type = request.data.get("model_type")
        interval_seconds = request.data.get("interval_seconds")

        crop_x = request.data.get("crop_x")
        crop_y = request.data.get("crop_y")
        crop_width = request.data.get("crop_width")
        crop_height = request.data.get("crop_height")

        if not uploaded_file:
            return Response(
                {"error": "No file uploaded."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if input_type not in ["image", "video"]:
            return Response(
                {"error": "Invalid input_type. Must be image or video."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if model_type not in ["yolo", "faster_rcnn", "ssd"]:
            return Response(
                {"error": "Invalid model_type."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        job_id = uuid.uuid4().hex
        _, file_extension = os.path.splitext(uploaded_file.name)
        file_extension = file_extension or ""

        crop = None

        if input_type == "video":
            if not interval_seconds:
                return Response(
                    {"error": "interval_seconds is required for video."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if (
                crop_x is None
                or crop_y is None
                or crop_width is None
                or crop_height is None
            ):
                return Response(
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
                return Response(
                    {"error": "Invalid video parameters."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        folder = "images" if input_type == "image" else "videos"
        file_path = f"{folder}/{job_id}/original{file_extension}"

        try:
            saved_path = default_storage.save(file_path, uploaded_file)
            file_url = request.build_absolute_uri(default_storage.url(saved_path))
        except Exception as error:
            return Response(
                {"error": f"Failed to save uploaded file: {str(error)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        response_data = {
            "message": "File uploaded successfully.",
            "job_id": job_id,
            "input_type": input_type,
            "model_type": model_type,
            "file_path": saved_path,
            "file_url": file_url,
        }

        if input_type == "image":
            try:
                inference_result = run_image_inference(
                    job_id=job_id,
                    model_type=model_type,
                    image_path=saved_path,
                )
            except (ModalInferenceError, FileNotFoundError) as error:
                return Response(
                    {
                        **response_data,
                        "error": str(error),
                    },
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            response_data.update(
                {
                    "message": "Image uploaded and inference completed.",
                    "inference_results": inference_result,
                }
            )

            return Response(response_data, status=status.HTTP_201_CREATED)

        try:
            video_full_path = os.path.join(settings.MEDIA_ROOT, saved_path)

            video_result = extract_snapshots_from_video(
                video_path=video_full_path,
                interval_seconds=interval_seconds,
                crop=crop,
                job_id=job_id,
            )

        except Exception as error:
            return Response(
                {
                    **response_data,
                    "error": f"Video preprocessing failed: {str(error)}",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        snapshots = []

        for snapshot in video_result["snapshots"]:
            snapshot_url = request.build_absolute_uri(
                default_storage.url(snapshot["snapshot_path"])
            )

            snapshots.append(
                {
                    **snapshot,
                    "snapshot_url": snapshot_url,
                }
            )

        try:
            inference_result = run_video_inference(
                job_id=job_id,
                model_type=model_type,
                snapshots=snapshots,
            )
        except (ModalInferenceError, FileNotFoundError) as error:
            return Response(
                {
                    **response_data,
                    "interval_seconds": interval_seconds,
                    "crop": crop,
                    "video_metadata": {
                        "fps": video_result["fps"],
                        "total_frames": video_result["total_frames"],
                        "duration_seconds": video_result["duration_seconds"],
                        "video_width": video_result["video_width"],
                        "video_height": video_result["video_height"],
                        "frame_interval": video_result["frame_interval"],
                    },
                    "snapshots": snapshots,
                    "error": str(error),
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        response_data.update(
            {
                "message": "Video uploaded, preprocessed, and inference completed.",
                "interval_seconds": interval_seconds,
                "crop": crop,
                "video_metadata": {
                    "fps": video_result["fps"],
                    "total_frames": video_result["total_frames"],
                    "duration_seconds": video_result["duration_seconds"],
                    "video_width": video_result["video_width"],
                    "video_height": video_result["video_height"],
                    "frame_interval": video_result["frame_interval"],
                },
                "snapshots": snapshots,
                "inference_results": inference_result,
            }
        )

        return Response(response_data, status=status.HTTP_201_CREATED)
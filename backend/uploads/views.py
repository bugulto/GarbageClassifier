import os

from django.conf import settings
from django.core.files.storage import default_storage

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

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

        folder = "images" if input_type == "image" else "videos"
        file_path = os.path.join(folder, uploaded_file.name)

        saved_path = default_storage.save(file_path, uploaded_file)
        file_url = request.build_absolute_uri(settings.MEDIA_URL + saved_path)

        response_data = {
            "message": "File uploaded successfully.",
            "input_type": input_type,
            "model_type": model_type,
            "file_path": saved_path,
            "file_url": file_url,
        }

        if input_type == "image":
            return Response(response_data, status=status.HTTP_201_CREATED)

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

            video_full_path = os.path.join(settings.MEDIA_ROOT, saved_path)

            snapshots = extract_snapshots_from_video(
                video_path=video_full_path,
                interval_seconds=interval_seconds,
                crop=crop,
            )

        except Exception as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response_data.update(
            {
                "interval_seconds": interval_seconds,
                "crop": crop,
                "snapshots": snapshots,
            }
        )

        return Response(response_data, status=status.HTTP_201_CREATED)
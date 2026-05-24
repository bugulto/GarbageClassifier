import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.core.files.storage import default_storage


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

        if input_type == "video":
            response_data.update({
                "interval_seconds": interval_seconds,
                "crop": {
                    "x": crop_x,
                    "y": crop_y,
                    "width": crop_width,
                    "height": crop_height,
                },
            })

        return Response(response_data, status=status.HTTP_201_CREATED)


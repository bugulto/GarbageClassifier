import os

from django.conf import settings

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from inference.modal_client import ModalInferenceError
from inference.services import run_image_inference, run_video_inference
from preprocessing.video_processor import extract_snapshots_from_video

from .services import (
    validate_upload_request,
    generate_job_id,
    save_uploaded_file,
    build_base_response,
    build_snapshot_urls,
    build_video_metadata,
)


class UploadView(APIView):

    def post(self, request):
        params, error_response = validate_upload_request(request)

        if error_response:
            return error_response

        job_id = generate_job_id()
        try:
            saved_path = save_uploaded_file(
                uploaded_file=params["uploaded_file"],
                input_type=params["input_type"],
                job_id=job_id,
            )
        except Exception as error:
            return Response(
                {"error": f"Failed to save uploaded file: {str(error)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        response_data = build_base_response(
            request=request,
            job_id=job_id,
            input_type=params["input_type"],
            model_type=params["model_type"],
            saved_path=saved_path,
        )
        if params["input_type"] == "image":
            return self._handle_image(request, params, response_data, job_id, saved_path)

        return self._handle_video(request, params, response_data, job_id, saved_path)

    def _handle_image(self, request, params, response_data, job_id, saved_path):

        try:
            inference_result = run_image_inference(
                job_id=job_id,
                model_type=params["model_type"],
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

        response_data.update({
            "message": "Image uploaded and inference completed.",
            "inference_results": inference_result,
        })

        return Response(response_data, status=status.HTTP_201_CREATED)

    def _handle_video(self, request, params, response_data, job_id, saved_path):
        interval_seconds = params["interval_seconds"]
        crop = params["crop"]

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

        snapshots = build_snapshot_urls(request, video_result["snapshots"])
        video_metadata = build_video_metadata(video_result)

        try:
            inference_result = run_video_inference(
                job_id=job_id,
                model_type=params["model_type"],
                snapshots=snapshots,
            )
        except (ModalInferenceError, FileNotFoundError) as error:
            return Response(
                {
                    **response_data,
                    "interval_seconds": interval_seconds,
                    "crop": crop,
                    "video_metadata": video_metadata,
                    "snapshots": snapshots,
                    "error": str(error),
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        response_data.update({
            "message": "Video uploaded, preprocessed, and inference completed.",
            "interval_seconds": interval_seconds,
            "crop": crop,
            "video_metadata": video_metadata,
            "snapshots": snapshots,
            "inference_results": inference_result,
        })

        return Response(response_data, status=status.HTTP_201_CREATED)
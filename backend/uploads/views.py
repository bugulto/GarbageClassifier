import logging
import os

from django.conf import settings

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from inference.modal_client import ModalInferenceError
from inference.services import run_image_inference, run_video_inference
from preprocessing.video_processor import extract_snapshots_from_video
from results.services import save_results_and_build_response
from results.cleanup import cleanup_temporary_files

from .services import (
    validate_upload_request,
    generate_job_id,
    save_uploaded_file,
    build_snapshot_urls,
    build_video_metadata,
)


logger = logging.getLogger(__name__)


class UploadView(APIView):

    def post(self, request):
        params, error_response = validate_upload_request(request)

        if error_response:
            return error_response

        job_id = generate_job_id()

        try:
            saved_path, original_filename = save_uploaded_file(
                uploaded_file=params["uploaded_file"],
                input_type=params["input_type"],
                job_id=job_id,
            )
        except Exception as error:
            return Response(
                {"error": f"Failed to save uploaded file: {str(error)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if params["input_type"] == "image":
            return self._handle_image(request, params, job_id, saved_path, original_filename)

        return self._handle_video(request, params, job_id, saved_path, original_filename)

    def _handle_image(self, request, params, job_id, saved_path, original_filename):

        try:
            inference_result = run_image_inference(
                job_id=job_id,
                model_type=params["model_type"],
                image_path=saved_path,
            )
        except (ModalInferenceError, FileNotFoundError) as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        try:
            final_data = save_results_and_build_response(
                request=request,
                job_id=job_id,
                input_type="image",
                model_type=params["model_type"],
                original_filename=original_filename,
                inference_results=inference_result,
            )
        except Exception as error:
            return Response(
                {"error": f"Failed to save results: {str(error)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            cleanup_temporary_files(
                input_type="image",
                saved_path=saved_path,
                job_id=job_id,
            )
        except Exception:
            logger.warning("Cleanup failed for image job %s", job_id, exc_info=True)

        return Response(final_data, status=status.HTTP_201_CREATED)

    def _handle_video(self, request, params, job_id, saved_path, original_filename):
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
                {"error": f"Video preprocessing failed: {str(error)}"},
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
                {"error": str(error)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        try:
            final_data = save_results_and_build_response(
                request=request,
                job_id=job_id,
                input_type="video",
                model_type=params["model_type"],
                original_filename=original_filename,
                inference_results=inference_result,
                snapshots=snapshots,
                video_metadata=video_metadata,
                crop=crop,
                interval_seconds=interval_seconds,
            )
        except Exception as error:
            return Response(
                {"error": f"Failed to save results: {str(error)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            cleanup_temporary_files(
                input_type="video",
                saved_path=saved_path,
                job_id=job_id,
            )
        except Exception:
            logger.warning("Cleanup failed for video job %s", job_id, exc_info=True)

        return Response(final_data, status=status.HTTP_201_CREATED)
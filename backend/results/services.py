import logging
import os
from collections import defaultdict

from django.db import transaction
from django.core.files.storage import default_storage

from .models import Job, ResultImage, Detection, ResultSummary
from .annotator import create_annotated_image


logger = logging.getLogger(__name__)


def _build_snapshot_lookup(snapshots):
    lookup = {}
    for snapshot in snapshots:
        lookup[snapshot["snapshot_path"]] = snapshot
    return lookup


def _get_output_filename(input_type, image_path):
    if input_type == "image":
        return "annotated_original.jpg"

    basename = os.path.basename(image_path)
    name, _ = os.path.splitext(basename)
    return f"annotated_{name}.jpg"


def _build_annotated_url(request, annotated_image_path):
    """Build an absolute URL for the annotated image."""
    return request.build_absolute_uri(
        default_storage.url(annotated_image_path)
    )


def save_results_and_build_response(
    request,
    job_id,
    input_type,
    model_type,
    original_filename,
    inference_results,
    snapshots=None,
    video_metadata=None,
    crop=None,
    interval_seconds=None,
):
    results_list = inference_results.get("results", [])

    snapshot_lookup = {}
    if snapshots:
        snapshot_lookup = _build_snapshot_lookup(snapshots)

    with transaction.atomic():
        job = _create_job(
            job_id=job_id,
            input_type=input_type,
            model_type=model_type,
            original_filename=original_filename,
            video_metadata=video_metadata,
            crop=crop,
            interval_seconds=interval_seconds,
        )

        all_result_images = []
        class_counts = defaultdict(lambda: {"count": 0, "class_id": None})

        for result in results_list:
            image_path = result["image_path"]
            image_width = result["image_width"]
            image_height = result["image_height"]
            detections = result.get("detections", [])

            output_filename = _get_output_filename(input_type, image_path)

            annotated_image_path = create_annotated_image(
                job_id=job_id,
                source_image_path=image_path,
                detections=detections,
                image_width=image_width,
                image_height=image_height,
                output_filename=output_filename,
            )

            annotated_image_url = _build_annotated_url(
                request, annotated_image_path
            )

            snapshot_meta = snapshot_lookup.get(image_path, {})

            result_image = ResultImage.objects.create(
                job=job,
                result_type="snapshot" if input_type == "video" else "image",
                annotated_image_path=annotated_image_path,
                annotated_image_url=annotated_image_url,
                image_width=image_width,
                image_height=image_height,
                timestamp_seconds=snapshot_meta.get("timestamp_seconds"),
                snapshot_index=snapshot_meta.get("snapshot_index"),
                frame_index=snapshot_meta.get("frame_index"),
                detection_count=len(detections),
            )

            detection_objects = []
            for det in detections:
                bbox = det["bbox"]
                detection_objects.append(Detection(
                    result_image=result_image,
                    class_name=det["class_name"],
                    class_id=det.get("class_id"),
                    confidence=det["confidence"],
                    bbox_x1=bbox["x1"],
                    bbox_y1=bbox["y1"],
                    bbox_x2=bbox["x2"],
                    bbox_y2=bbox["y2"],
                ))

                class_name = det["class_name"]
                class_counts[class_name]["count"] += 1
                if det.get("class_id") is not None:
                    class_counts[class_name]["class_id"] = det["class_id"]

            if detection_objects:
                Detection.objects.bulk_create(detection_objects)

            all_result_images.append({
                "result_image": result_image,
                "detections": detections,
            })

        summary_objects = []
        for class_name, info in class_counts.items():
            summary_objects.append(ResultSummary(
                job=job,
                class_name=class_name,
                class_id=info["class_id"],
                count=info["count"],
            ))

        if summary_objects:
            ResultSummary.objects.bulk_create(summary_objects)

        total_detections = sum(info["count"] for info in class_counts.values())
        total_result_images = len(all_result_images)

        job.total_detections = total_detections
        job.total_result_images = total_result_images
        job.save(update_fields=["total_detections", "total_result_images"])

    return _build_final_response(
        job_id=job_id,
        input_type=input_type,
        model_type=model_type,
        original_filename=original_filename,
        class_counts=class_counts,
        total_detections=total_detections,
        total_result_images=total_result_images,
        all_result_images=all_result_images,
    )


def _create_job(job_id, input_type, model_type, original_filename,
                video_metadata=None, crop=None, interval_seconds=None):
    job_kwargs = {
        "job_id": job_id,
        "input_type": input_type,
        "model_type": model_type,
        "original_filename": original_filename,
        "status": "completed",
    }

    if input_type == "video":
        job_kwargs["interval_seconds"] = interval_seconds

        if crop:
            job_kwargs["crop_x"] = crop.get("x")
            job_kwargs["crop_y"] = crop.get("y")
            job_kwargs["crop_width"] = crop.get("width")
            job_kwargs["crop_height"] = crop.get("height")

        if video_metadata:
            job_kwargs["fps"] = video_metadata.get("fps")
            job_kwargs["total_frames"] = video_metadata.get("total_frames")
            job_kwargs["duration_seconds"] = video_metadata.get("duration_seconds")
            job_kwargs["video_width"] = video_metadata.get("video_width")
            job_kwargs["video_height"] = video_metadata.get("video_height")
            job_kwargs["frame_interval"] = video_metadata.get("frame_interval")

    return Job.objects.create(**job_kwargs)


def _build_final_response(job_id, input_type, model_type, original_filename,
                           class_counts, total_detections, total_result_images,
                           all_result_images):
    if input_type == "image":
        message = "Image inference completed and results saved."
    else:
        message = "Video inference completed and results saved."

    summary = {name: info["count"] for name, info in class_counts.items()}

    result_images_data = []
    for item in all_result_images:
        result_image = item["result_image"]
        detections = item["detections"]

        image_data = {
            "result_type": result_image.result_type,
            "annotated_image_url": result_image.annotated_image_url,
            "image_width": result_image.image_width,
            "image_height": result_image.image_height,
            "detection_count": result_image.detection_count,
            "detections": [
                {
                    "class_name": det["class_name"],
                    "class_id": det.get("class_id"),
                    "confidence": det["confidence"],
                    "bbox": det["bbox"],
                }
                for det in detections
            ],
        }

        if input_type == "video":
            image_data["timestamp_seconds"] = result_image.timestamp_seconds
            image_data["snapshot_index"] = result_image.snapshot_index
            image_data["frame_index"] = result_image.frame_index

        result_images_data.append(image_data)

    return {
        "message": message,
        "status": "completed",
        "job_id": job_id,
        "input_type": input_type,
        "model_type": model_type,
        "original_filename": original_filename,
        "summary": summary,
        "total_detections": total_detections,
        "total_result_images": total_result_images,
        "result_images": result_images_data,
    }

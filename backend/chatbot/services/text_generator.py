from datetime import datetime, date


def get_predictions_from_job(job):
    return {
        summary.class_name: summary.count
        for summary in job.summaries.all()
    }


def generate_text(filename, predictions, job=None):
    input_type = "file"
    model_type = "unknown model"
    total_detections = sum(predictions.values())
    total_result_images = None

    if job:
        input_type = job.input_type
        model_type = job.model_type
        total_detections = job.total_detections
        total_result_images = job.total_result_images

    parts = [
        (
            f"{input_type.title()} file {filename} was processed for garbage classification. "
            f"Detected on {date.today()} at {datetime.now().time().replace(microsecond=0)}. "
            f"The model used was {model_type}. "
            f"The job contains {total_detections} total detected garbage item(s)."
        )
    ]

    if total_result_images is not None:
        parts.append(
            f"The job produced {total_result_images} annotated result image(s)."
        )

    if not predictions:
        parts.append("No garbage items were detected.")
    else:
        for classification, count in sorted(predictions.items()):
            parts.append(
                f"It contains {count} {classification.lower()} item(s)."
            )

        dominant_class, dominant_count = max(
            predictions.items(),
            key=lambda item: item[1],
        )

        parts.append(
            f"The dominant detected waste type is {dominant_class.lower()} "
            f"with {dominant_count} item(s)."
        )

    if job and job.input_type == "video":
        parts.append(
            f"This was a video job with duration {job.duration_seconds} seconds "
            f"and snapshots extracted every {job.interval_seconds} seconds."
        )

    return " ".join(parts)


def generate_text_for_job(job):
    predictions = get_predictions_from_job(job)
    filename = job.original_filename or "unknown file"

    return generate_text(
        filename=filename,
        predictions=predictions,
        job=job,
    )
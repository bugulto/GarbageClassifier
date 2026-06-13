from django.db.models import Sum

from results.models import Job, ResultSummary


MAX_GLOBAL_JOBS = 20
MAX_DETECTIONS_PER_IMAGE = 30


class ChatContextBuilder:
    def build_context(self, question, job_id=None):
        if job_id:
            return self._build_job_context(job_id)

        return self._build_global_context()

    def _build_job_context(self, job_id):
        job = (
            Job.objects
            .prefetch_related(
                "summaries",
                "result_images",
                "result_images__detections",
            )
            .get(job_id=job_id)
        )

        lines = []

        lines.append("Context scope: single classification job.")
        lines.append(f"Job ID: {job.job_id}")
        lines.append(f"Original filename: {job.original_filename or 'unknown'}")
        lines.append(f"Input type: {job.input_type}")
        lines.append(f"Model type: {job.model_type}")
        lines.append(f"Status: {job.status}")
        lines.append(f"Created at: {job.created_at}")
        lines.append(f"Total detections: {job.total_detections}")
        lines.append(f"Total result images: {job.total_result_images}")

        if job.input_type == "video":
            lines.append("Video metadata:")
            lines.append(f"- Interval seconds: {job.interval_seconds}")
            lines.append(f"- FPS: {job.fps}")
            lines.append(f"- Total frames: {job.total_frames}")
            lines.append(f"- Duration seconds: {job.duration_seconds}")
            lines.append(f"- Video width: {job.video_width}")
            lines.append(f"- Video height: {job.video_height}")
            lines.append(f"- Frame interval: {job.frame_interval}")
            lines.append(
                "- Crop: "
                f"x={job.crop_x}, y={job.crop_y}, "
                f"width={job.crop_width}, height={job.crop_height}"
            )

        lines.append("")
        lines.append("Class summary:")

        summaries = list(job.summaries.all())
        if summaries:
            for summary in summaries:
                lines.append(
                    f"- {summary.class_name}: {summary.count} item(s)"
                )
        else:
            lines.append("- No detected classes.")

        lines.append("")
        lines.append("Result images and detections:")

        result_images = list(job.result_images.all())

        if not result_images:
            lines.append("- No result images stored.")
        else:
            for result_image in result_images:
                image_label = self._get_result_image_label(result_image)

                lines.append("")
                lines.append(f"{image_label}")
                lines.append(f"- Result type: {result_image.result_type}")
                lines.append(
                    f"- Image size: {result_image.image_width}x{result_image.image_height}"
                )
                lines.append(f"- Detection count: {result_image.detection_count}")

                detections = list(result_image.detections.all())

                if not detections:
                    lines.append("- No detections in this result image.")
                    continue

                for detection in detections[:MAX_DETECTIONS_PER_IMAGE]:
                    lines.append(
                        "- "
                        f"{detection.class_name} "
                        f"(class_id={detection.class_id}, "
                        f"confidence={detection.confidence:.3f}, "
                        f"bbox=({detection.bbox_x1:.1f}, "
                        f"{detection.bbox_y1:.1f}, "
                        f"{detection.bbox_x2:.1f}, "
                        f"{detection.bbox_y2:.1f}))"
                    )

                if len(detections) > MAX_DETECTIONS_PER_IMAGE:
                    remaining = len(detections) - MAX_DETECTIONS_PER_IMAGE
                    lines.append(f"- {remaining} additional detections omitted.")

        return "\n".join(lines)

    def _build_global_context(self):
        jobs = (
            Job.objects
            .prefetch_related("summaries")
            .order_by("-created_at")[:MAX_GLOBAL_JOBS]
        )

        total_jobs = Job.objects.count()

        total_detections = (
            Job.objects.aggregate(total=Sum("total_detections"))["total"] or 0
        )

        class_totals = (
            ResultSummary.objects
            .values("class_name")
            .annotate(total=Sum("count"))
            .order_by("-total")
        )

        lines = []

        lines.append("Context scope: global classification history.")
        lines.append(f"Total jobs stored: {total_jobs}")
        lines.append(f"Total detections across all jobs: {total_detections}")

        lines.append("")
        lines.append("Overall class totals:")

        class_totals = list(class_totals)
        if class_totals:
            for item in class_totals:
                lines.append(f"- {item['class_name']}: {item['total']} item(s)")
        else:
            lines.append("- No detections stored yet.")

        lines.append("")
        lines.append(f"Latest {MAX_GLOBAL_JOBS} jobs:")

        jobs = list(jobs)
        if not jobs:
            lines.append("- No jobs found.")
        else:
            for job in jobs:
                summary_text = self._format_job_summary(job)

                lines.append(
                    "- "
                    f"Job ID: {job.job_id}; "
                    f"filename: {job.original_filename or 'unknown'}; "
                    f"type: {job.input_type}; "
                    f"model: {job.model_type}; "
                    f"created: {job.created_at}; "
                    f"total detections: {job.total_detections}; "
                    f"result images: {job.total_result_images}; "
                    f"summary: {summary_text}"
                )

        return "\n".join(lines)

    def _format_job_summary(self, job):
        summaries = list(job.summaries.all())

        if not summaries:
            return "no detections"

        return ", ".join(
            f"{summary.class_name}: {summary.count}"
            for summary in summaries
        )

    def _get_result_image_label(self, result_image):
        if result_image.result_type == "snapshot":
            return (
                f"Snapshot index {result_image.snapshot_index}, "
                f"frame {result_image.frame_index}, "
                f"timestamp {result_image.timestamp_seconds} seconds:"
            )

        return "Image result:"
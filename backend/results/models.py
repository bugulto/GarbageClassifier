from django.db import models
from django.core.files.storage import default_storage, storages


class Job(models.Model):
    INPUT_TYPE_CHOICES = [
        ("image", "Image"),
        ("video", "Video"),
    ]

    MODEL_TYPE_CHOICES = [
        ("yolo", "YOLO"),
        ("faster_rcnn", "Faster R-CNN"),
        ("ssd", "SSD"),
    ]

    STATUS_CHOICES = [
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    job_id = models.CharField(max_length=64, unique=True, db_index=True)

    input_type = models.CharField(max_length=20, choices=INPUT_TYPE_CHOICES)
    model_type = models.CharField(max_length=30, choices=MODEL_TYPE_CHOICES)
    original_filename = models.CharField(max_length=255, blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="completed",
    )

    # Video-only metadata
    interval_seconds = models.FloatField(blank=True, null=True)

    crop_x = models.IntegerField(blank=True, null=True)
    crop_y = models.IntegerField(blank=True, null=True)
    crop_width = models.IntegerField(blank=True, null=True)
    crop_height = models.IntegerField(blank=True, null=True)

    fps = models.FloatField(blank=True, null=True)
    total_frames = models.IntegerField(blank=True, null=True)
    duration_seconds = models.FloatField(blank=True, null=True)
    video_width = models.IntegerField(blank=True, null=True)
    video_height = models.IntegerField(blank=True, null=True)
    frame_interval = models.IntegerField(blank=True, null=True)

    # Cached summary fields
    total_detections = models.IntegerField(default=0)
    total_result_images = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.job_id} ({self.input_type}, {self.model_type})"


class ResultImage(models.Model):
    RESULT_TYPE_CHOICES = [
        ("image", "Image"),
        ("snapshot", "Snapshot"),
    ]

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="result_images",
    )

    result_type = models.CharField(max_length=20, choices=RESULT_TYPE_CHOICES)

    annotated_image_path = models.CharField(max_length=500)

    image_width = models.IntegerField()
    image_height = models.IntegerField()

    # Video snapshot metadata
    timestamp_seconds = models.FloatField(blank=True, null=True)
    snapshot_index = models.IntegerField(blank=True, null=True)
    frame_index = models.IntegerField(blank=True, null=True)

    detection_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp_seconds", "id"]

    def __str__(self):
        return f"{self.job.job_id} - {self.result_type}"
    
    @property
    def annotated_image_url(self):
        if not self.annotated_image_path:
            return None
        b2_storage = storages['b2']
        return b2_storage.url(self.annotated_image_path)  # signed temporary URL from cloud storage (BlackBlaze B2 via django-storages)


class Detection(models.Model):
    result_image = models.ForeignKey(
        ResultImage,
        on_delete=models.CASCADE,
        related_name="detections",
    )

    class_name = models.CharField(max_length=100)
    class_id = models.IntegerField(blank=True, null=True)

    confidence = models.FloatField()

    bbox_x1 = models.FloatField()
    bbox_y1 = models.FloatField()
    bbox_x2 = models.FloatField()
    bbox_y2 = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-confidence"]

    def __str__(self):
        return f"{self.class_name} ({self.confidence:.2f})"


class ResultSummary(models.Model):
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="summaries",
    )

    class_name = models.CharField(max_length=100)
    class_id = models.IntegerField(blank=True, null=True)
    count = models.IntegerField(default=0)

    class Meta:
        unique_together = ("job", "class_name")
        ordering = ["class_name"]

    def __str__(self):
        return f"{self.job.job_id} - {self.class_name}: {self.count}"
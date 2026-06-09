from django.contrib import admin

from .models import Job, ResultImage, Detection, ResultSummary


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = [
        "job_id",
        "input_type",
        "model_type",
        "status",
        "total_detections",
        "total_result_images",
        "created_at",
    ]
    list_filter = ["input_type", "model_type", "status"]
    search_fields = ["job_id", "original_filename"]


@admin.register(ResultImage)
class ResultImageAdmin(admin.ModelAdmin):
    list_display = [
        "job",
        "result_type",
        "image_width",
        "image_height",
        "detection_count",
        "created_at",
    ]
    list_filter = ["result_type"]


@admin.register(Detection)
class DetectionAdmin(admin.ModelAdmin):
    list_display = [
        "result_image",
        "class_name",
        "class_id",
        "confidence",
    ]
    list_filter = ["class_name"]


@admin.register(ResultSummary)
class ResultSummaryAdmin(admin.ModelAdmin):
    list_display = [
        "job",
        "class_name",
        "count",
    ]
    list_filter = ["class_name"]

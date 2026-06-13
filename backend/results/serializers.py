from rest_framework import serializers

from .models import Job, ResultImage, Detection, ResultSummary


class ResultSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultSummary
        fields = [
            "class_name",
            "class_id",
            "count",
        ]


class DetectionSerializer(serializers.ModelSerializer):
    bbox = serializers.SerializerMethodField()

    class Meta:
        model = Detection
        fields = [
            "class_name",
            "class_id",
            "confidence",
            "bbox",
        ]

    def get_bbox(self, obj):
        return {
            "x1": obj.bbox_x1,
            "y1": obj.bbox_y1,
            "x2": obj.bbox_x2,
            "y2": obj.bbox_y2,
        }


class ResultImageSerializer(serializers.ModelSerializer):
    detections = DetectionSerializer(many=True, read_only=True)

    class Meta:
        model = ResultImage
        fields = [
            "result_type",
            "annotated_image_url",
            "image_width",
            "image_height",
            "timestamp_seconds",
            "snapshot_index",
            "frame_index",
            "detection_count",
            "detections",
        ]


class JobListSerializer(serializers.ModelSerializer):
    summary = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "job_id",
            "input_type",
            "model_type",
            "original_filename",
            "status",
            "summary",
            "total_detections",
            "total_result_images",
            "created_at",
        ]

    def get_summary(self, obj):
        return {
            item.class_name: item.count
            for item in obj.summaries.all()
        }


class JobDetailSerializer(serializers.ModelSerializer):
    summary = serializers.SerializerMethodField()
    result_images = ResultImageSerializer(many=True, read_only=True)
    video_metadata = serializers.SerializerMethodField()
    crop = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "job_id",
            "input_type",
            "model_type",
            "original_filename",
            "status",
            "summary",
            "total_detections",
            "total_result_images",
            "video_metadata",
            "crop",
            "result_images",
            "created_at",
            "updated_at",
        ]

    def get_summary(self, obj):
        return {
            item.class_name: item.count
            for item in obj.summaries.all()
        }

    def get_video_metadata(self, obj):
        if obj.input_type != "video":
            return None

        return {
            "interval_seconds": obj.interval_seconds,
            "fps": obj.fps,
            "total_frames": obj.total_frames,
            "duration_seconds": obj.duration_seconds,
            "video_width": obj.video_width,
            "video_height": obj.video_height,
            "frame_interval": obj.frame_interval,
        }

    def get_crop(self, obj):
        if obj.input_type != "video":
            return None

        return {
            "x": obj.crop_x,
            "y": obj.crop_y,
            "width": obj.crop_width,
            "height": obj.crop_height,
        }
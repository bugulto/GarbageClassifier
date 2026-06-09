from rest_framework import generics
from rest_framework.exceptions import NotFound

from .models import Job
from .serializers import JobListSerializer, JobDetailSerializer


class JobHistoryListView(generics.ListAPIView):
    serializer_class = JobListSerializer

    def get_queryset(self):
        queryset = (
            Job.objects
            .prefetch_related("summaries")
            .order_by("-created_at")
        )

        input_type = self.request.query_params.get("input_type")
        model_type = self.request.query_params.get("model_type")
        status = self.request.query_params.get("status")

        if input_type:
            queryset = queryset.filter(input_type=input_type)

        if model_type:
            queryset = queryset.filter(model_type=model_type)

        if status:
            queryset = queryset.filter(status=status)

        return queryset


class JobDetailView(generics.RetrieveAPIView):
    serializer_class = JobDetailSerializer
    lookup_field = "job_id"

    def get_queryset(self):
        return (
            Job.objects
            .prefetch_related(
                "summaries",
                "result_images",
                "result_images__detections",
            )
        )

    def get_object(self):
        job_id = self.kwargs.get("job_id")

        try:
            return self.get_queryset().get(job_id=job_id)
        except Job.DoesNotExist:
            raise NotFound("Job not found.")
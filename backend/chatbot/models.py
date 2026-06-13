from django.db import models
from pgvector.django import VectorField

from results.models import Job


EMBEDDING_DIMENSIONS = 768


class RAGDocument(models.Model):
    SOURCE_TYPE_CHOICES = [
        ("job_summary", "Job Summary"),
    ]

    job = models.OneToOneField(
        Job,
        on_delete=models.CASCADE,
        related_name="rag_document",
    )

    source_type = models.CharField(
        max_length=50,
        choices=SOURCE_TYPE_CHOICES,
        default="job_summary",
    )

    title = models.CharField(max_length=255)
    text = models.TextField()

    embedding = VectorField(dimensions=EMBEDDING_DIMENSIONS)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.source_type} - {self.job.job_id}"
from results.models import Job

from chatbot.models import RAGDocument
from chatbot.services.embedding_service import EmbeddingService
from chatbot.services.text_generator import generate_text_for_job


class RAGIngestionService:
    def __init__(self):
        self.embedding_service = EmbeddingService()

    def create_or_update_for_job(self, job):
        job = self._load_job(job)

        text = generate_text_for_job(job)
        embedding = self.embedding_service.generate_embeddings(text)

        title = self._build_title(job)

        rag_document, _ = RAGDocument.objects.update_or_create(
            job=job,
            defaults={
                "source_type": "job_summary",
                "title": title,
                "text": text,
                "embedding": embedding,
            },
        )

        return rag_document

    def create_missing_documents(self, limit=None):
        queryset = (
            Job.objects
            .filter(rag_document__isnull=True)
            .prefetch_related("summaries")
            .order_by("-created_at")
        )

        if limit:
            queryset = queryset[:limit]

        created_documents = []

        for job in queryset:
            created_documents.append(self.create_or_update_for_job(job))

        return created_documents

    def rebuild_all_documents(self):
        queryset = (
            Job.objects
            .prefetch_related("summaries")
            .order_by("-created_at")
        )

        rebuilt_documents = []

        for job in queryset:
            rebuilt_documents.append(self.create_or_update_for_job(job))

        return rebuilt_documents

    def _load_job(self, job):
        if isinstance(job, Job):
            return (
                Job.objects
                .prefetch_related("summaries")
                .get(id=job.id)
            )

        return (
            Job.objects
            .prefetch_related("summaries")
            .get(job_id=job)
        )

    def _build_title(self, job):
        filename = job.original_filename or "unknown file"
        return f"{job.input_type.title()} result for {filename}"
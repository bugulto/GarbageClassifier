from django.conf import settings
from pgvector.django import CosineDistance

from chatbot.models import RAGDocument
from chatbot.services.embedding_service import EmbeddingService


class RAGRetrievalService:
    def __init__(self, top_k=None):
        self.top_k = top_k or settings.RAG_TOP_K
        self.embedding_service = EmbeddingService()

    def retrieve_context(self, question, job_id=None):
        question_vector = self.embedding_service.generate_embeddings(question)

        queryset = RAGDocument.objects.select_related("job")

        if job_id:
            queryset = queryset.filter(job__job_id=job_id)

        queryset = (
            queryset
            .annotate(distance=CosineDistance("embedding", question_vector))
            .order_by("distance")[:self.top_k]
        )

        return list(queryset)

    def build_context_text(self, documents):
        if not documents:
            return "No stored RAG documents were found."

        parts = []

        for document in documents:
            parts.append(
                "\n".join(
                    [
                        f"RAG Document ID: {document.id}",
                        f"Job ID: {document.job.job_id}",
                        f"Title: {document.title}",
                        f"Text: {document.text}",
                    ]
                )
            )

        return "\n\n".join(parts)
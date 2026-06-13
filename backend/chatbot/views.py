from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from results.models import Job

from chatbot.serializers import ChatRequestSerializer
from chatbot.services.answer_service import HybridLlamaAnswerService
from chatbot.services.context_builder import ChatContextBuilder
from chatbot.services.ingestion_service import RAGIngestionService
from chatbot.services.retrieval_service import RAGRetrievalService


class ChatbotView(APIView):
    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = serializer.validated_data["question"].strip()
        job_id = serializer.validated_data.get("job_id") or None

        context_builder = ChatContextBuilder()
        retrieval_service = RAGRetrievalService()
        answer_service = HybridLlamaAnswerService()

        try:
            db_context = context_builder.build_context(
                question=question,
                job_id=job_id,
            )
        except Job.DoesNotExist:
            return Response(
                {"error": "Job not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if job_id:
            self._ensure_job_rag_document_exists(job_id)

        rag_documents = retrieval_service.retrieve_context(
            question=question,
            job_id=job_id,
        )
        rag_context = retrieval_service.build_context_text(rag_documents)

        try:
            answer = answer_service.answer(
                question=question,
                db_context=db_context,
                rag_context=rag_context,
            )
        except Exception as error:
            return Response(
                {
                    "error": "Failed to generate chatbot response.",
                    "detail": str(error),
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            {
                "answer": answer,
                "job_id": job_id,
                "scope": "job" if job_id else "global",
                "rag_sources": [
                    {
                        "job_id": document.job.job_id,
                        "title": document.title,
                        "source_type": document.source_type,
                    }
                    for document in rag_documents
                ],
            },
            status=status.HTTP_200_OK,
        )

    def _ensure_job_rag_document_exists(self, job_id):
        job = (
            Job.objects
            .filter(job_id=job_id)
            .select_related("rag_document")
            .first()
        )

        if not job:
            return

        if hasattr(job, "rag_document"):
            return

        try:
            RAGIngestionService().create_or_update_for_job(job)
        except Exception:
            pass
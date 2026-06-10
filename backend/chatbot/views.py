from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from results.models import Job

from .serializers import ChatRequestSerializer
from .services.answer_service import LlamaAnswerService
from .services.context_builder import ChatContextBuilder


class ChatbotView(APIView):
    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = serializer.validated_data["question"].strip()
        job_id = serializer.validated_data.get("job_id") or None

        context_builder = ChatContextBuilder()

        try:
            context = context_builder.build_context(
                question=question,
                job_id=job_id,
            )
        except Job.DoesNotExist:
            return Response(
                {"error": "Job not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            answer_service = LlamaAnswerService()
            answer = answer_service.answer(
                question=question,
                context=context,
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
            },
            status=status.HTTP_200_OK,
        )
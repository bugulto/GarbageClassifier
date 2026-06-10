from django.conf import settings
from langchain_ollama import ChatOllama


class LlamaAnswerService:
    def __init__(self):
        self.llm = ChatOllama(
            model=settings.OLLAMA_CHAT_MODEL,
            temperature=settings.OLLAMA_TEMPERATURE,
        )

    def answer(self, question, context):
        response = self.llm.invoke(
            [
                (
                    "system",
                    "You are a chatbot for a garbage classification web app. "
                    "Answer questions using only the provided database context. "
                    "If the answer is not available in the context, say that clearly. "
                    "For counts, filenames, models, timestamps, and class names, use the exact values from context. "
                    "Keep answers concise and helpful.",
                ),
                (
                    "human",
                    f"Database context:\n{context}\n\nQuestion:\n{question}",
                ),
            ]
        )

        return response.content.strip()
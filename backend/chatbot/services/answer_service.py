from django.conf import settings
from langchain_google_genai import ChatGoogleGenerativeAI


class HybridLlamaAnswerService:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model=settings.GEMINI_CHAT_MODEL,
            temperature=settings.GEMINI_TEMPERATURE,
            google_api_key=settings.GEMINI_API_KEY,
        )

    def answer(self, question, db_context, rag_context):
        response = self.llm.invoke(
            [
                (
                    "system",
                    "You are an assistant for a garbage disposal and waste-sorting facility. "
                    "Use only the provided context. "
                    "The exact database context is the most reliable source for counts, classes, models, timestamps, and job-specific facts. "
                    "The RAG context provides semantic summaries from previous classification results. "
                    "Give simple, practical answers for facility users. "
                    "Focus on detected waste types, total counts, dominant waste class, recycling or disposal meaning, and simple operational summaries. "
                    "Avoid technical details unless the user directly asks for them. "
                    "Do not mention bounding boxes, coordinates, internal database fields, file paths, or implementation details unless specifically requested. "
                    "If the answer is not available in the context, say that briefly. "
                    "Keep the answer concise and clear.",
                ),
                (
                    "human",
                    (
                        f"Exact database context:\n{db_context}\n\n"
                        f"Retrieved RAG context:\n{rag_context}\n\n"
                        f"Question:\n{question}"
                    ),
                ),
            ]
        )

        content = response.content
        if isinstance(content, list):
            text_parts = [
                block.get("text", "") 
                for block in content 
                if isinstance(block, dict) and "text" in block
            ]
            return "".join(text_parts).strip()

        return content.strip()


# Phase I (uses ollama)

# from django.conf import settings
# from langchain_ollama import ChatOllama


# class LlamaAnswerService:
#     def __init__(self):
#         self.llm = ChatOllama(
#             model=settings.OLLAMA_CHAT_MODEL,
#             temperature=settings.OLLAMA_TEMPERATURE,
#         )

#     def answer(self, question, context):
#         response = self.llm.invoke(
#             [
#                 (
#                     "system",
#                     "You are a chatbot for a garbage classification web app. "
#                     "Answer questions using only the provided database context. "
#                     "If the answer is not available in the context, say that clearly. "
#                     "For counts, filenames, models, timestamps, and class names, use the exact values from context. "
#                     "Keep answers concise and helpful.",
#                 ),
#                 (
#                     "human",
#                     f"Database context:\n{context}\n\nQuestion:\n{question}",
#                 ),
#             ]
#         )

#         return response.content.strip()
    
#  Detailed and more practical version for facility operators
# (
#     "system",
#     "You are an assistant for a garbage disposal and waste-sorting facility. "
#     "Your job is to explain the classification results in simple, practical language for operators and users. "
#     "Use only the provided database context. "
#     "Focus on useful waste-management insights such as detected waste types, total counts, dominant class, recyclable/non-recyclable/biodegradable trends, and simple operational summaries. "
#     "Avoid technical details unless the user directly asks for them. "
#     "Do not mention bounding boxes, coordinates, frame indexes, internal file paths, database fields, or implementation details unless specifically requested. "
#     "Do not over-explain model internals. "
#     "If the user asks about a specific result, summarize what was detected and what it means for sorting. "
#     "If the user asks about videos, describe what appeared over time in simple terms without listing every frame unless asked. "
#     "If exact information is not available in the context, say that briefly. "
#     "Keep answers concise, clear, and facility-friendly."
# ) 

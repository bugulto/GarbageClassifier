from django.conf import settings
from google import genai
from google.genai import types


class EmbeddingService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model = settings.GEMINI_EMBEDDING_MODEL
        self.output_dim = settings.GEMINI_EMBEDDING_DIM

    def generate_embeddings(self, text):
        response = self.client.models.embed_content(
            model=self.model,
            contents=text,
            config=types.EmbedContentConfig(
                output_dimensionality=self.output_dim,
            ),
        )

        return response.embeddings[0].values

# from django.conf import settings
# from langchain_ollama import OllamaEmbeddings


# class EmbeddingService:
#     def __init__(self):
#         self.embeddings_obj = OllamaEmbeddings(
#             model=settings.OLLAMA_EMBEDDING_MODEL,
#         )

#     def generate_embeddings(self, text):
#         return self.embeddings_obj.embed_query(text)
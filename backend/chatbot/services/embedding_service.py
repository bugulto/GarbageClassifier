from django.conf import settings
from langchain_ollama import OllamaEmbeddings


class EmbeddingService:
    def __init__(self):
        self.embeddings_obj = OllamaEmbeddings(
            model=settings.OLLAMA_EMBEDDING_MODEL,
        )

    def generate_embeddings(self, text):
        return self.embeddings_obj.embed_query(text)
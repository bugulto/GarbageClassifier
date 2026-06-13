from django.contrib import admin

from chatbot.models import RAGDocument


@admin.register(RAGDocument)
class RAGDocumentAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "job",
        "source_type",
        "title",
        "created_at",
        "updated_at",
    ]
    list_filter = ["source_type", "created_at"]
    search_fields = [
        "job__job_id",
        "job__original_filename",
        "title",
        "text",
    ]
    readonly_fields = [
        "created_at",
        "updated_at",
    ]
from django.core.management.base import BaseCommand

from chatbot.services.ingestion_service import RAGIngestionService


class Command(BaseCommand):
    help = "Create or rebuild RAG documents for classification jobs."

    def add_arguments(self, parser):
        parser.add_argument(
            "--rebuild",
            action="store_true",
            help="Rebuild all RAG documents, including existing ones.",
        )
        parser.add_argument(
            "--limit",
            type=int,
            default=None,
            help="Limit number of jobs to process.",
        )

    def handle(self, *args, **options):
        service = RAGIngestionService()

        if options["rebuild"]:
            documents = service.rebuild_all_documents()
            self.stdout.write(
                self.style.SUCCESS(
                    f"Rebuilt {len(documents)} RAG document(s)."
                )
            )
            return

        documents = service.create_missing_documents(
            limit=options.get("limit")
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {len(documents)} missing RAG document(s)."
            )
        )
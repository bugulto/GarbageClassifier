from django.urls import path

from .views import JobHistoryListView, JobDetailView


urlpatterns = [
    path("jobs/", JobHistoryListView.as_view(), name="job-history-list"),
    path("jobs/<str:job_id>/", JobDetailView.as_view(), name="job-detail"),
]
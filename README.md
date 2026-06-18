# Industrial Garbage Classification & Analysis Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://waste-vision-phi.vercel.app/)
[![API Backend](https://img.shields.io/badge/Backend-Render-blue?style=for-the-badge&logo=render)](https://garbageclassifier.onrender.com/api)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/Gemini-AI-orange?style=for-the-badge&logo=googlegemini)](https://deepmind.google/technologies/gemini/)

## Live Deployments

| Service | URL |
| :--- | :--- |
| Frontend Application | [https://waste-vision-phi.vercel.app](https://waste-vision-phi.vercel.app) — hosted on Vercel |
| Backend API | [https://garbageclassifier.onrender.com/api](https://garbageclassifier.onrender.com/api) — hosted on Render |

> **Note:** The backend is hosted on Render's free tier and spins down after inactivity. The first request after a period of idle may take 20–30 seconds to respond while the service cold-starts. Subsequent requests are normal speed.

---

## Project Overview

A production-deployed, full-stack **Industrial Waste Classification and Retrieval-Augmented Generation (RAG)** platform. The system ingests image and video uploads, runs object detection to identify and catalog recyclable, biodegradable, and hazardous materials, and exposes a conversational interface for querying classification history.

Beyond simple detection, the platform acts as an analytical workspace. Classification results are indexed in a PostgreSQL vector database (`pgvector`), enabling a hybrid conversational agent powered by Google Gemini. Operators can query job-specific statistics or analyze global, multi-job waste composition trends using natural language.

---

## System Architecture

```mermaid
graph TD
    User([User / Operator]) -->|Uploads Media / Chats| React[React Frontend - Vercel]
    React -->|API Request / CORS| Django[Django REST API - Render]

    subgraph Django Orchestration [Django Backend Pipeline]
        Django -->|1. Extract Frames and Crop| OpenCV[OpenCV Headless]
        Django -->|2. Dispatch Frames via HTTP| Modal[Serverless GPU Inference - Modal]
        Django -->|3. Upload Annotated Output| B2[Backblaze B2 Storage]
        Django -->|4. Store Metadata and Embeddings| DB[(PostgreSQL + pgvector - Supabase)]
        Django -->|5. Context Retrieval and Chat| Gemini[Google Gemini API]
    end

    Modal -->|Returns JSON Detections| Django
    B2 -->|Returns Object Keys| Django
    Gemini -->|Generates Response| Django
```

---

## Technical Architecture and Engineering Decisions

### 1. Serverless GPU Inference via Modal

Running continuous GPU servers for computer vision inference is cost-prohibitive. Instead, the backend orchestrates a serverless inference pipeline:

- Media is preprocessed locally using `opencv-python-headless` (frame extraction, region-of-interest cropping).
- Preprocessed frames are dispatched to **Modal**, which runs YOLO models on serverless GPU containers that scale to zero when idle.
- The Django backend on Render handles only orchestration — no model weights are loaded into its memory, keeping the backend footprint minimal and free-tier compatible.

### 2. Ephemeral-Safe Cloud Storage via Backblaze B2

Render's filesystem is ephemeral and resets on every redeploy. To ensure permanent storage of annotated detection outputs:

- Annotated images are uploaded to **Backblaze B2** via an S3-compatible API using `django-storages` and `boto3`.
- The `ResultImage` model stores only the permanent storage key (e.g. `results/{job_id}/annotated_original.jpg`), never a URL.
- Signed, time-limited URLs are generated dynamically on every API response via `default_storage.url()`, ensuring links are always valid and never stale regardless of when the job was created.
- The bucket is private; no annotated image is directly publicly accessible.

### 3. Hybrid RAG with Semantic Embeddings

Every classification job generates a natural-language summary (e.g. *"Job 45 processed demo-video.mp4 using YOLO, detecting 4 cardboard boxes and 2 plastic bottles"*). These summaries are:

- Vectorized using `gemini-embedding-001` and stored in PostgreSQL via the `pgvector` extension as 768-dimensional vectors.
- Retrieved at query time via cosine similarity search against the user's question embedding.
- Combined with exact relational database statistics (counts, class summaries, timestamps) and passed together as context to **Gemini 3.1 Flash-Lite**, which generates accurate, grounded responses without hallucination.

### 4. Production-Ready Django Configuration

- Uses `opencv-python-headless` instead of `opencv-python`, avoiding GUI dependency crashes in headless Linux environments.
- Enforces strict security settings when `DEBUG=False`: SSL redirection, secure cookies, HSTS headers, and dynamic CORS origin validation.
- Database connections routed through Supabase's PgBouncer transaction-mode pooler (`conn_max_age=0`, `DISABLE_SERVER_SIDE_CURSORS=True`) to avoid connection exhaustion on Render's single-worker deployment.
- Static files served via WhiteNoise with compressed manifest storage, requiring no separate static file host.

### 5. Type-Safe React Frontend

- Built with Vite for fast development and optimized production builds.
- Robust environment variable normalization: cleans trailing slashes and dynamically appends `/api` prefixes if omitted from `VITE_API_BASE_URL`.
- `npm run lint` produces zero errors and zero warnings under strict ESLint configuration (`no-unused-vars`, `react-hooks` rules).

---

## Database Schema

Managed in PostgreSQL (Supabase, with `pgvector` extension enabled):

| Model | Purpose |
| :--- | :--- |
| `Job` | Tracks each classification run: input type, model type, filename, status, crop parameters, and video metadata. |
| `ResultImage` | Stores the B2 storage key for each annotated output image. URL is computed dynamically, never stored. |
| `Detection` | Individual detected objects: class name, class ID, confidence score, and bounding box coordinates. |
| `ResultSummary` | Aggregated per-class counts per job, enabling fast SQL summary queries without scanning `Detection` rows. |
| `RagDocument` | Natural-language job summary paired with its 768-dimensional `pgvector` embedding for semantic retrieval. |

---

## API Reference

All endpoints are prefixed under `/api/`.

| Method | Endpoint | Description | Payload / Params |
| :--- | :--- | :--- | :--- |
| POST | `/api/upload/` | Ingests image or video, extracts frames, dispatches to Modal inference, saves results. | Multipart form-data: `file`, `model_type`, optional crop params |
| GET | `/api/results/jobs/` | Lists historical classification jobs with filtering support. | Query params: `input_type`, `model_type`, `status` |
| GET | `/api/results/jobs/<id>/` | Full job detail including annotated image URLs and per-detection data. | — |
| POST | `/api/chat/` | Submits a natural language query to the hybrid RAG chatbot. Scoped to a job or global. | JSON: `{ "question": "...", "job_id": null }` |

---

## Local Development Setup

### Prerequisites

- Node.js v18+
- Python 3.10+
- A [Supabase](https://supabase.com) project with the `pgvector` extension enabled (free tier, no expiry)
- A [Google Gemini API key](https://aistudio.google.com) (free tier)
- A [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) bucket with a scoped application key (free tier, optional for local dev — falls back to local media storage if B2 env vars are absent)
- A [Modal](https://modal.com) account with the inference endpoint deployed

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```ini
DEBUG=True
SECRET_KEY=your-django-secret-key

# Supabase connection string (Project Settings -> Database -> URI)
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres

GEMINI_API_KEY=your-gemini-api-key
MODAL_INFERENCE_URL=https://your-modal-endpoint.modal.run

# Backblaze B2 (optional for local dev)
B2_KEY_ID=your-b2-key-id
B2_APPLICATION_KEY=your-b2-application-key
B2_BUCKET_NAME=your-bucket-name
B2_REGION=your-bucket-region
```

```bash
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```ini
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

```bash
npm run dev
```

---

## Screenshots

| View | Preview |
| :--- | :--- |
| Media Upload Workspace | ![Upload Workspace](ss/Screenshot%20from%202026-06-14%2015-53-58.png) |
| Job Details Dashboard | ![Details Dashboard](ss/Screenshot%20from%202026-06-14%2015-55-21.png) |
| Detection Details View | ![Detections View](ss/Screenshot%20from%202026-06-14%2015-56-14.png) |
| Job-Scoped Chat Assistant | ![Local Chat](ss/Screenshot%20from%202026-06-14%2015-57-54.png) |
| Global Analytical Chat | ![Global Chat](ss/Screenshot%20from%202026-06-14%2015-58-26.png) |

---

## Known Limitations

- **Single Gunicorn worker:** The Render free tier provides 512MB RAM. Running multiple workers causes out-of-memory kills due to cumulative process overhead, so the backend runs with `--workers 1`. This is sufficient for a demo workload but would not support meaningful concurrent traffic.
- **Cold starts:** Render's free tier spins down inactive services. The first request after ~15 minutes of inactivity may take 20–30 seconds while the service restarts.
- **Shared classification history:** There is no user authentication. All visitors share the same job history and RAG knowledge base, which is appropriate for a demo context but would require an auth layer for a multi-tenant production deployment.
- **Gemini free tier rate limits:** The chatbot uses Gemini 3.1 Flash-Lite on the free tier (500 requests/day). Heavy concurrent usage during a demo session could approach this ceiling.

---

## Future Improvements

- Asynchronous inference pipeline using Celery and Redis, replacing the current synchronous request/response flow
- Per-user authentication and job isolation
- Real-time job status updates via WebSocket
- Expanded RAG knowledge base with disposal regulations and recycling guidelines by material class
- Analytics dashboard with detection trend charts across the full job history
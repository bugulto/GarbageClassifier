# ♻️ Garbage Classification & Analysis Platform

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-black?style=for-the-badge&logo=ollama&logoColor=white)

## Project Overview

This project is a comprehensive, full-stack garbage classification web application designed to identify, classify, and analyze waste materials from images and videos. Built as a demonstration of integrating modern web technologies with advanced machine learning computer vision models and local LLM-based Retrieval-Augmented Generation (RAG), this platform provides deep insights into waste composition. It is engineered to support both automated processing and interactive analytical workflows.

## Features

- **Media Processing:** Support for both image and video garbage classification.
- **Advanced Video Analysis:** Configurable video frame extraction intervals and crop region selection for targeted inference.
- **Visual Detections:** Generation of annotated result images with bounding boxes for identified waste items.
- **Comprehensive Reporting:** Automated generation of detection summaries and detailed historical logs per job.
- **Interactive Chat Interface:** 
  - *Job-specific Chatbot:* Ask questions regarding the specific results of an individual inference job.
  - *Global Chatbot:* Analyze trends and query data across all historical detection jobs.
- **RAG & Local LLMs:** RAG-based retrieval powered by PostgreSQL vector search, coupled with local LLM inference via Ollama for privacy-focused data analysis.

## System Architecture

The application is structured into a decoupled frontend and backend:

- **Frontend (React):** Manages user interactions, file uploads (with cropping support), displaying annotated results, rendering history/job details, and providing the chat interface.
- **Backend (Django):** Orchestrates the heavy lifting—running inference pipelines, saving annotations, generating result images, managing detection history, executing RAG retrieval, and providing context to the chatbot.
- **ML Pipeline:** Utilizes state-of-the-art computer vision models (YOLO, Faster R-CNN, SSD) for object detection, paired with Llama 3 and EmbeddingGemma for semantic analysis and interactive chat.

## Tech Stack

### Frontend
- **Framework:** React
- **Routing:** React Router
- **HTTP Client:** Axios

### Backend
- **Framework:** Django
- **API:** Django REST Framework (DRF)
- **Database:** PostgreSQL (with `pgvector` for RAG)

### AI & Machine Learning
- **Computer Vision:** YOLO, Faster R-CNN, SSD
- **LLM / Conversational:** Llama 3 (via Ollama)
- **Embeddings:** EmbeddingGemma

## Database Overview

The relational and vector data is modeled using PostgreSQL. The core entities include:

- **`Job`:** Represents a single upload and processing task (image or video).
- **`ResultImage`:** Stores the generated annotated images for a specific job.
- **`Detection`:** Contains individual object detection records (bounding boxes, class labels, confidence scores) linked to a result image.
- **`ResultSummary`:** Aggregates detection statistics and metadata for a job.
- **`RagDocument`:** Stores vectorized textual representations of results and contextual data to facilitate the RAG-based global and local chatbots.

## Installation

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PostgreSQL (with `pgvector` extension)
- Ollama (with `llama3` and appropriate embedding models pulled)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your `.env` file with your PostgreSQL credentials.
5. Run database migrations:
   ```bash
   python manage.py migrate
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   python manage.py runserver
   ```
2. **Start the Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```
3. **Start Ollama (if not running as a service):**
   ```bash
   ollama serve
   ```
4. Access the application in your browser at `http://localhost:5173` (or the port specified by Vite/React).

## API Overview

The Django REST Framework exposes several key endpoints to facilitate frontend-backend communication:

- `POST /api/upload/`: Accepts image/video files, cropping parameters, and initiates the ML inference pipeline.
- `GET /api/jobs/`: Retrieves a paginated list of historical inference jobs.
- `GET /api/jobs/<id>/`: Retrieves comprehensive details for a specific job, including generated images and detection summaries.
- `POST /api/chat/job/<id>/`: Submits a query to the local LLM using the context of a specific job.
- `POST /api/chat/global/`: Submits a global query to the LLM utilizing RAG over all historical data.

## Screenshots

![Upload UI](<ss/Screenshot from 2026-06-14 15-53-58.png>)
![Dashboard/Results Page](<ss/Screenshot from 2026-06-14 15-55-21.png>)
![Job Details](<ss/Screenshot from 2026-06-14 15-56-14.png>)
![Chatbot Interface 1](<ss/Screenshot from 2026-06-14 15-57-54.png>)
![Chatbot Interface 2](<ss/Screenshot from 2026-06-14 15-58-26.png>)

## Future Improvements

- Expanding the object detection capabilities to more granular waste sub-categories.
- Adding real-time websocket connections for live video stream classification.
- Dockerized deployment for simplified setup and cloud hosting.
- Background processing for large video uploads using Celery and Redis.
- Enhanced RAG knowledge base with recycling guidelines and disposal recommendations.
- Analytics dashboard for waste trends, detection statistics, and reporting.
- Batch processing and export of results (PDF/CSV).

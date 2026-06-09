// TODO: Replace mock data with real API calls when backend history endpoints are implemented.
// Expected real endpoints:
//   GET /api/results/jobs/
//   GET /api/results/jobs/:jobId/

const MOCK_JOBS = [
  {
    job_id: 'mock-job-1',
    input_type: 'image',
    model_type: 'yolo',
    original_filename: 'sample.jpg',
    summary: { METAL: 3, PAPER: 1 },
    total_detections: 4,
    total_result_images: 1,
    created_at: '2026-06-12T10:00:00Z',
  },
  {
    job_id: 'mock-job-2',
    input_type: 'video',
    model_type: 'faster_rcnn',
    original_filename: 'street_footage.mp4',
    summary: { PLASTIC: 7, GLASS: 2 },
    total_detections: 9,
    total_result_images: 5,
    created_at: '2026-06-12T11:30:00Z',
  },
  {
    job_id: 'mock-job-3',
    input_type: 'image',
    model_type: 'ssd',
    original_filename: 'trash_bin.png',
    summary: {},
    total_detections: 0,
    total_result_images: 1,
    created_at: '2026-06-12T12:15:00Z',
  },
]

const MOCK_JOB_DETAIL = {
  message: 'Mock result detail',
  job_id: 'mock-job-1',
  input_type: 'image',
  model_type: 'yolo',
  original_filename: 'sample.jpg',
  summary: { METAL: 3, PAPER: 1 },
  total_detections: 4,
  total_result_images: 1,
  result_images: [
    {
      result_type: 'annotated',
      annotated_image_url: '',
      timestamp_seconds: null,
      snapshot_index: null,
      frame_index: null,
      image_width: 640,
      image_height: 480,
      detection_count: 4,
      detections: [
        {
          class_name: 'METAL',
          class_id: 0,
          confidence: 0.923,
          bbox: { x1: 100, y1: 50, x2: 250, y2: 200 },
        },
        {
          class_name: 'METAL',
          class_id: 0,
          confidence: 0.871,
          bbox: { x1: 300, y1: 100, x2: 420, y2: 280 },
        },
        {
          class_name: 'METAL',
          class_id: 0,
          confidence: 0.654,
          bbox: { x1: 50, y1: 300, x2: 180, y2: 410 },
        },
        {
          class_name: 'PAPER',
          class_id: 1,
          confidence: 0.812,
          bbox: { x1: 400, y1: 200, x2: 550, y2: 350 },
        },
      ],
    },
  ],
}

/**
 * Fetch all jobs (history list).
 * TODO: Replace with real API call: GET /api/results/jobs/
 */
export const getJobs = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_JOBS
}

/**
 * Fetch a single job detail by job_id.
 * TODO: Replace with real API call: GET /api/results/jobs/:jobId/
 */
export const getJobDetail = async (jobId) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { ...MOCK_JOB_DETAIL, job_id: jobId }
}

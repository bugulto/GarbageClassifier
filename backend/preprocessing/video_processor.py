import os
import cv2
from django.conf import settings

from .cropper import crop_frame


def extract_snapshots_from_video(
    video_path,
    interval_seconds,
    crop,
    output_folder="snapshots",
):

    interval_seconds = float(interval_seconds)

    if interval_seconds <= 0:
        raise ValueError("interval_seconds must be greater than 0.")

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise ValueError("Could not open video file.")

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if fps <= 0:
        cap.release()
        raise ValueError("Could not read video FPS.")

    frame_interval = max(1, int(fps * interval_seconds))

    snapshot_dir = os.path.join(settings.MEDIA_ROOT, output_folder)
    os.makedirs(snapshot_dir, exist_ok=True)

    saved_snapshots = []
    frame_index = 0
    snapshot_index = 0

    while frame_index < total_frames:
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_index)

        ret, frame = cap.read()

        if not ret:
            break

        cropped_frame = crop_frame(frame, crop)

        snapshot_filename = f"snapshot_{snapshot_index}_frame_{frame_index}.jpg"
        snapshot_path = os.path.join(snapshot_dir, snapshot_filename)

        cv2.imwrite(snapshot_path, cropped_frame)

        relative_path = os.path.join(output_folder, snapshot_filename)
        saved_snapshots.append({
            "snapshot_path": relative_path,
            "frame_index": frame_index,
            "timestamp_seconds": round(frame_index / fps, 2),
        })

        snapshot_index += 1
        frame_index += frame_interval

    cap.release()

    return saved_snapshots
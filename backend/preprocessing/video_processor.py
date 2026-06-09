import os

import cv2

from django.conf import settings

from .cropper import crop_frame


def extract_snapshots_from_video(
    video_path,
    interval_seconds,
    crop,
    job_id,
):

    if interval_seconds <= 0:
        raise ValueError("interval_seconds must be greater than 0.")

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise ValueError("Could not open video file.")

    try:
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        video_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        video_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        if fps <= 0:
            raise ValueError("Could not read video FPS.")

        duration_seconds = total_frames / fps if fps else 0
        frame_interval = max(1, int(fps * interval_seconds))

        snapshot_rel_dir = f"snapshots/{job_id}"
        snapshot_dir = os.path.join(settings.MEDIA_ROOT, snapshot_rel_dir)
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

            timestamp_seconds = round(frame_index / fps, 2)
            snapshot_filename = f"frame_{frame_index:06d}_t{timestamp_seconds:.2f}.jpg"
            snapshot_path = os.path.join(snapshot_dir, snapshot_filename)

            cv2.imwrite(snapshot_path, cropped_frame)

            relative_path = f"{snapshot_rel_dir}/{snapshot_filename}"
            saved_snapshots.append({
                "snapshot_index": snapshot_index,
                "frame_index": frame_index,
                "timestamp_seconds": timestamp_seconds,
                "snapshot_path": relative_path,
            })

            snapshot_index += 1
            frame_index += frame_interval
    finally:
        cap.release()

    return {
        "fps": fps,
        "total_frames": total_frames,
        "duration_seconds": round(duration_seconds, 2),
        "video_width": video_width,
        "video_height": video_height,
        "frame_interval": frame_interval,
        "snapshots": saved_snapshots,
    }
from collections import Counter
from ultralytics import YOLO


class YOLO_Inference:
    def __init__(self, model_path, tracker_path=None):
        self.model = YOLO(str(model_path))
        self.tracker_path = str(tracker_path) if tracker_path else None
        self.seen_track_ids = set()
        self.total_counts = Counter()

    def predict(self, frame):
        results = self.model.track(frame, persist=True, tracker=self.tracker_path)
        for result in results:
            boxes = result.boxes
            if boxes is None or boxes.id is None:
                continue

            track_ids = boxes.id.cpu().numpy()
            class_ids = boxes.cls.cpu().numpy()

            for track_id, class_id in zip(track_ids, class_ids):
                track_id = int(track_id)
                if track_id not in self.seen_track_ids:
                    self.seen_track_ids.add(track_id)
                    class_name = self.model.names[int(class_id)]
                    self.total_counts[class_name] += 1

        return dict(self.total_counts)

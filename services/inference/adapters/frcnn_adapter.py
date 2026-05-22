from collections import Counter
import supervision as sv
import torch

class FRCNN_Inference:
    def __init__(self, model_path,):
        self.model = torch.load(model_path)
        self.tracker = sv.ByteTrack()
        self.seen_track_ids = set()
        self.total_counts = Counter()
    
    def predict(self, frame):
        results = self.model(frame)[0]

        boxes = results["boxes"].cpu().numpy()
        scores = results["scores"].cpu().numpy()
        labels = results["labels"].cpu().numpy()

        detections = sv.Detections(
        xyxy=boxes,
        confidence=scores,
        class_id=labels
        )

        detections = self.tracker.update_with_detections(detections=detections)

        track_ids = detections.tracker_id
        class_ids = detections.class_id

        for track_id, class_id in zip(track_ids, class_ids):
            track_id = int(track_id)
            if track_id not in self.seen_track_ids:
                self.seen_track_ids.add(track_id)
                class_name = self.model.names[int(class_id)]
                self.total_counts[class_name] += 1

        return dict(self.total_counts)
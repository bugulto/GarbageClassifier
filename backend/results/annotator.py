import os

import cv2

from django.conf import settings


BBOX_COLOR = (0, 255, 0)
BBOX_THICKNESS = 2
LABEL_FONT = cv2.FONT_HERSHEY_SIMPLEX
LABEL_FONT_SCALE = 0.5
LABEL_FONT_THICKNESS = 1
LABEL_BG_COLOR = (0, 255, 0)
LABEL_TEXT_COLOR = (0, 0, 0)
LABEL_PADDING = 4


def clamp_bbox(bbox, image_width, image_height):
    x1 = max(0, min(bbox["x1"], image_width))
    y1 = max(0, min(bbox["y1"], image_height))
    x2 = max(0, min(bbox["x2"], image_width))
    y2 = max(0, min(bbox["y2"], image_height))
    return int(x1), int(y1), int(x2), int(y2)


def draw_detections(image, detections, image_width, image_height):
    for detection in detections:
        bbox = detection["bbox"]
        x1, y1, x2, y2 = clamp_bbox(bbox, image_width, image_height)

        cv2.rectangle(image, (x1, y1), (x2, y2), BBOX_COLOR, BBOX_THICKNESS)

        label = f"{detection['class_name']} {detection['confidence']:.2f}"
        (text_w, text_h), _ = cv2.getTextSize(
            label, LABEL_FONT, LABEL_FONT_SCALE, LABEL_FONT_THICKNESS
        )

        label_y = max(y1 - LABEL_PADDING, text_h + LABEL_PADDING)
        cv2.rectangle(
            image,
            (x1, label_y - text_h - LABEL_PADDING),
            (x1 + text_w + LABEL_PADDING, label_y + LABEL_PADDING),
            LABEL_BG_COLOR,
            cv2.FILLED,
        )
        cv2.putText(
            image,
            label,
            (x1 + 2, label_y),
            LABEL_FONT,
            LABEL_FONT_SCALE,
            LABEL_TEXT_COLOR,
            LABEL_FONT_THICKNESS,
        )

    return image


def create_annotated_image(job_id, source_image_path, detections,
                           image_width, image_height, output_filename=None):
    """
    Draws detections on the source image and saves the annotated result.
    Returns the relative media path to the annotated image.
    """
    full_source_path = os.path.join(settings.MEDIA_ROOT, source_image_path)

    if not os.path.isfile(full_source_path):
        raise FileNotFoundError(f"Source image not found: {full_source_path}")

    image = cv2.imread(full_source_path)

    if image is None:
        raise ValueError(f"Could not read image: {full_source_path}")

    draw_detections(image, detections, image_width, image_height)

    result_dir = os.path.join(settings.MEDIA_ROOT, "results", job_id)
    os.makedirs(result_dir, exist_ok=True)

    if output_filename is None:
        output_filename = "annotated_original.jpg"

    output_full_path = os.path.join(result_dir, output_filename)
    cv2.imwrite(output_full_path, image)

    return f"results/{job_id}/{output_filename}"

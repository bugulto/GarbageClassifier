def validate_crop(frame_width, frame_height, crop):
    x = int(crop["x"])
    y = int(crop["y"])
    width = int(crop["width"])
    height = int(crop["height"])

    if x < 0:
        x = 0

    if y < 0:
        y = 0

    if x + width > frame_width:
        width = frame_width - x

    if y + height > frame_height:
        height = frame_height - y

    if width <= 0 or height <= 0:
        raise ValueError("Invalid crop region.")

    return x, y, width, height


def crop_frame(frame, crop):
    frame_height, frame_width = frame.shape[:2]

    x, y, width, height = validate_crop(
        frame_width=frame_width,
        frame_height=frame_height,
        crop=crop,
    )

    cropped_frame = frame[y:y + height, x:x + width]

    return cropped_frame
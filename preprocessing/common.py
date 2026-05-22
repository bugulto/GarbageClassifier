import cv2

def letterbox(frame, resized_shape=(640, 640), color=(114, 114, 114)):
    # Resizes and adds padding to the input frame while maintaining aspect ratio
    shape = frame.shape[:2]

    # Scale factor (new/old)
    r = min(resized_shape[0] / shape[0], resized_shape[1] / shape[1])

    # Compute padding
    new_unpad = (int(round(shape[1] * r)), int(round(shape[0] * r)))
    dw, dh = resized_shape[1] - new_unpad[0], resized_shape[0] - new_unpad[1]  # wh padding

    dw /= 2  # divide padding into top/bottom, left/right
    dh /= 2

    if shape[::-1] != new_unpad:  # resize
        frame = cv2.resize(frame, new_unpad, interpolation=cv2.INTER_LINEAR)

    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))

    frame = cv2.copyMakeBorder(frame, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)
    return frame


def roi_cropping(frame, roi_config):
    h, w, _ = frame.shape

    ymin, ymax = int(h * roi_config["ymin"]), int(h * roi_config["ymax"])
    xmin, xmax = int(w * roi_config["xmin"]), int(w * roi_config["xmax"])

    if xmin >= xmax or ymin >= ymax:
        raise ValueError(f"Invalid ROI for frame shape {frame.shape}: {roi_config}")

    return xmin, xmax, ymin, ymax


class YoloPreprocessor:
    def __init__(self, input_size=(640, 640), roi=None):
        self.input_size = tuple(input_size)
        self.roi = roi or {
                "xmin": 0.0,
                "xmax": 1.0,
                "ymin": 0.0,
                "ymax": 1.0,
        }

    def process(self, frame):
        xmin, xmax, ymin, ymax = roi_cropping(frame, self.roi)
        cropped_frame = frame[ymin:ymax, xmin:xmax]
        return letterbox(cropped_frame, resized_shape=self.input_size)


class RCNNPreprocessor:
    def __init__(self, input_size=None, roi=None):
        self.input_size = input_size
        self.roi = roi

    def process(self, frame):
        xmin, xmax, ymin, ymax = roi_cropping(frame, self.roi)
        cropped_frame = frame[ymin:ymax, xmin:xmax]
        return letterbox(cropped_frame, resized_shape=self.input_size)


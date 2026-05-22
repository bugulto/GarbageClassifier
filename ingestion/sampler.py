import cv2
import numpy as np

from preprocessing.common import letterbox, roi_cropping

def sampling(cap, config):
     
    TARGET_INFERENCE_FPS = config["sampling"]["target_fps"] # Number of frames we actually want to process per second
    SOURCE_FPS = cap.get(cv2.CAP_PROP_FPS) # Get the original FPS of the video
    frame_interval = int(SOURCE_FPS / TARGET_INFERENCE_FPS)

    Input_size = config["preprocessing"]["input_size"]

    frame_count = 0

    # Generator function that yields preprocessed frames from the video feed
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("End of video stream or error loading video.")
            return
        frame_count += 1

        if frame_count % frame_interval != 0:
            continue

        xmin, xmax, ymin, ymax = roi_cropping(frame, config["preprocessing"]["roi"])
        cropped_frame = frame[ymin:ymax, xmin:xmax]

        letterboxed_frame = letterbox(cropped_frame, resized_shape=Input_size)

        # Visualizations (Optional: overlaying ROI boundary box on the live window)
        cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)
        cv2.putText(frame, f"Processing Frame: {frame_count}", (30, 40), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        cv2.imshow("Original Feed with ROI Box", frame)
        cv2.imshow("What YOLO Sees (640x640 Letterbox)", letterboxed_frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        yield letterboxed_frame

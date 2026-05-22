import cv2
import os

def video_source(video_config, project_root):
    source = video_config["source"]
    video_path = os.path.join(project_root, source)
    #video_path = project_root / source
    return cv2.VideoCapture(str(video_path))
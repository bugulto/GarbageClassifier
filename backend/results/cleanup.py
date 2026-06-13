import logging
import os
import shutil

from django.conf import settings


logger = logging.getLogger(__name__)


def delete_media_file(relative_path):
    full_path = os.path.join(settings.MEDIA_ROOT, relative_path)

    try:
        if os.path.isfile(full_path):
            os.remove(full_path)
    except OSError:
        logger.warning("Failed to delete media file: %s", full_path, exc_info=True)


def delete_media_folder(relative_folder):
    full_path = os.path.join(settings.MEDIA_ROOT, relative_folder)

    try:
        if os.path.isdir(full_path):
            shutil.rmtree(full_path)
    except OSError:
        logger.warning("Failed to delete media folder: %s", full_path, exc_info=True)


def cleanup_temporary_files(input_type, saved_path, job_id):
    delete_media_file(saved_path)

    parent_folder = os.path.dirname(saved_path)
    delete_media_folder(parent_folder)

    if input_type == "video":
        snapshot_folder = f"snapshots/{job_id}"
        delete_media_folder(snapshot_folder)

import requests

from django.conf import settings


class ModalInferenceError(Exception):
    pass


def call_modal_inference(payload):
    modal_url = settings.MODAL_INFERENCE_URL
    timeout = settings.MODAL_INFERENCE_TIMEOUT

    if not modal_url:
        raise ModalInferenceError("MODAL_INFERENCE_URL is not configured.")

    try:
        response = requests.post(
            modal_url,
            json=payload,
            timeout=timeout,
        )
    except requests.Timeout:
        raise ModalInferenceError("Modal inference request timed out.")
    except requests.ConnectionError:
        raise ModalInferenceError("Could not connect to Modal endpoint.")
    except requests.RequestException as error:
        raise ModalInferenceError(f"Modal request failed: {str(error)}")

    if response.status_code >= 400:
        try:
            error_detail = response.json()
        except ValueError:
            error_detail = response.text

        raise ModalInferenceError(
            f"Modal inference failed with status {response.status_code}: {error_detail}"
        )

    try:
        return response.json()
    except ValueError:
        raise ModalInferenceError("Modal returned invalid JSON.")
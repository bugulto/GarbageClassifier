class inferenceService:
    def __init__(self, model_adapter, preprocessor):
        self.model_adapter = model_adapter
        self.preprocessor = preprocessor

    def predict(self, frame):
        processed_frame = self.preprocessor.process(frame)
        return self.model_adapter.predict(processed_frame)
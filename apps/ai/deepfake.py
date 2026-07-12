"""Deepfake detection stub — wire DeepFace/Whisper when models available."""

from dataclasses import dataclass


@dataclass
class DeepfakeResult:
    is_fake: bool
    confidence: float
    media_type: str
    details: str


async def analyze_media(file_path: str, media_type: str) -> DeepfakeResult:
    """
    Production: DeepFace for images/video, Whisper+Wav2Vec for audio.
    Returns manipulation confidence and heatmap path.
    """
    return DeepfakeResult(
        is_fake=False,
        confidence=0.12,
        media_type=media_type,
        details="Model not loaded — install deepface and whisper for live detection",
    )

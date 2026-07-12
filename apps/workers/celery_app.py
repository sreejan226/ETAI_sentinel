import os
import sys
from pathlib import Path

APPS_ROOT = Path(__file__).resolve().parent.parent
API_ROOT = APPS_ROOT / "api"
sys.path.insert(0, str(APPS_ROOT))
sys.path.insert(0, str(API_ROOT))

from celery import Celery
from services.pipeline import process_complaint

broker = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
backend = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")

celery_app = Celery("sentinelai", broker=broker, backend=backend)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
)


@celery_app.task(name="workers.process_complaint")
def process_complaint_task(complaint_id: str):
    import asyncio
    asyncio.run(process_complaint(complaint_id))

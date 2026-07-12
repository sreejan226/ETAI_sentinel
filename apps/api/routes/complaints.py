import sys
from pathlib import Path

APPS_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(APPS_ROOT))

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
import uuid
import aiofiles
from datetime import datetime, timezone

from database import get_db
from models import Complaint
from config import get_settings
from shared.schemas import ComplaintCreate, ComplaintResponse, ClassificationResult
from services.pipeline import process_complaint

router = APIRouter()
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/", response_model=ComplaintResponse)
async def submit_complaint(
    background_tasks: BackgroundTasks,
    description: str = Form(...),
    phone: Optional[str] = Form(None),
    upi_id: Optional[str] = Form(None),
    website: Optional[str] = Form(None),
    profile_link: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    amount: Optional[float] = Form(None),
    reporter_type: str = Form("citizen"),
    screenshot: Optional[UploadFile] = File(None),
    voice_note: Optional[UploadFile] = File(None),
    video: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
):
    """Anonymous complaint submission — no login required."""
    complaint_id = str(uuid.uuid4())
    media_paths = []

    for upload, label in [(screenshot, "screenshot"), (voice_note, "voice"), (video, "video")]:
        if upload and upload.filename:
            ext = Path(upload.filename).suffix or ".bin"
            path = UPLOAD_DIR / f"{complaint_id}_{label}{ext}"
            async with aiofiles.open(path, "wb") as f:
                await f.write(await upload.read())
            media_paths.append(str(path))

    complaint = Complaint(
        id=complaint_id,
        description=description,
        phone=phone,
        upi_id=upi_id,
        website=website,
        profile_link=profile_link,
        location=location,
        amount=amount,
        reporter_type=reporter_type,
        status="processing",
        media_paths=media_paths,
    )
    db.add(complaint)
    await db.commit()
    await db.refresh(complaint)

    settings = get_settings()
    if settings.use_celery:
        from workers.celery_app import process_complaint_task
        process_complaint_task.delay(complaint_id)
    else:
        background_tasks.add_task(process_complaint, complaint_id)

    return ComplaintResponse(
        id=complaint.id,
        description=complaint.description,
        status=complaint.status,
        created_at=complaint.created_at,
        location=complaint.location,
        amount=complaint.amount,
    )


@router.get("/", response_model=list[ComplaintResponse])
async def list_complaints(
    limit: int = 50,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(Complaint).order_by(Complaint.created_at.desc()).limit(limit)
    if status:
        query = query.where(Complaint.status == status)
    result = await db.execute(query)
    complaints = result.scalars().all()
    return [
        ComplaintResponse(
            id=c.id,
            description=c.description,
            status=c.status,
            classification=ClassificationResult(**c.classification) if c.classification else None,
            threat_score=c.threat_score,
            risk_color=c.risk_color,
            created_at=c.created_at,
            location=c.location,
            amount=c.amount,
        )
        for c in complaints
    ]


@router.get("/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint(complaint_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    complaint = result.scalar_one_or_none()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return ComplaintResponse(
        id=complaint.id,
        description=complaint.description,
        status=complaint.status,
        classification=ClassificationResult(**complaint.classification) if complaint.classification else None,
        threat_score=complaint.threat_score,
        risk_color=complaint.risk_color,
        created_at=complaint.created_at,
        location=complaint.location,
        amount=complaint.amount,
    )

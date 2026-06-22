from fastapi import APIRouter
from pydantic import BaseModel

from services.scam_service import (
    analyze_scam
)

router = APIRouter()


class ScamRequest(BaseModel):

    transcript: str


@router.post("/analyze-scam")
def analyze(data: ScamRequest):

    return analyze_scam(
        data.transcript
    )
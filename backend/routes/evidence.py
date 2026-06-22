from fastapi import APIRouter
from pydantic import BaseModel

from services.evidence_service import (
    generate_evidence_package
)

router = APIRouter()


class EvidenceRequest(BaseModel):
    case_id: int


@router.post("/generate-evidence")
def generate_evidence(data: EvidenceRequest):

    return generate_evidence_package(
        data.case_id
    )
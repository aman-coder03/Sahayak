from fastapi import APIRouter
from pydantic import BaseModel

from services.dna_service import generate_fraud_dna
from services.db_service import save_case
router = APIRouter()


class FraudDNARequest(BaseModel):

    phone: str

    upi: str

    transcript: str

    city: str

    state: str

    latitude: float

    longitude: float


@router.post("/generate-dna")
def generate_dna(data: FraudDNARequest):

    result = generate_fraud_dna(
        data.phone,
        data.upi,
        data.transcript
    )

    case_id = save_case(
        data,
        result
    )

    result["case_id"] = case_id

    return result
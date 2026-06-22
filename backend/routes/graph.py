from fastapi import APIRouter
from pydantic import BaseModel

from services.graph_service import (
    build_fraud_network
)

router = APIRouter()


class GraphRequest(BaseModel):
    phone: str
    upi: str
    transcript: str


@router.post("/fraud-network")
def fraud_network(data: GraphRequest):

    return build_fraud_network(
        data.phone,
        data.upi,
        data.transcript
    )
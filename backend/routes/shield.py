from fastapi import APIRouter
from pydantic import BaseModel

from services.shield_service import (
    analyze_citizen_risk
)

router = APIRouter()


class ShieldRequest(BaseModel):

    message: str


@router.post("/citizen-shield")
def citizen_shield(
    data: ShieldRequest
):

    return analyze_citizen_risk(
        data.message
    )
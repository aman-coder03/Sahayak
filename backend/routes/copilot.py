from fastapi import APIRouter
from pydantic import BaseModel

from services.copilot_service import (
    investigator_query
)

router = APIRouter()


class CopilotRequest(BaseModel):
    query: str


@router.post("/copilot")
def copilot(data: CopilotRequest):

    return investigator_query(
        data.query
    )
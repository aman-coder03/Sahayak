from fastapi import APIRouter

from services.dashboard_service import (
    dashboard_summary
)

router = APIRouter()


@router.get("/dashboard-summary")
def get_dashboard_summary():

    return dashboard_summary()
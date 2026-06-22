from fastapi import APIRouter

from services.geospatial_service import (
    get_crime_hotspots
)

router = APIRouter()


@router.get("/crime-hotspots")
def crime_hotspots():

    return get_crime_hotspots()
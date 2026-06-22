from fastapi import APIRouter

from services.map_service import (
    generate_crime_map
)

router = APIRouter()


@router.get("/crime-map")
def crime_map():

    return generate_crime_map()
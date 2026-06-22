from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.scam import router as scam_router
from routes.fraud_dna import router as dna_router
from routes.graph import router as graph_router
from routes.copilot import router as copilot_router
from routes.evidence import router as evidence_router
from routes.shield import router as shield_router
from routes.geospatial import router as geospatial_router
from routes.map import router as map_router
from routes.dashboard import router as dashboard_router

app = FastAPI(
    title="SAHAYAK API",
    version="1.0"
)

app.include_router(scam_router)
app.include_router(dna_router)
app.include_router(graph_router)
app.include_router(copilot_router)
app.include_router(evidence_router)
app.include_router(shield_router)
app.include_router(geospatial_router)
app.include_router(map_router)
app.include_router(dashboard_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "SAHAYAK API Running"
    }
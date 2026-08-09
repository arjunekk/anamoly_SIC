"""
Entry point for the FastAPI backend.
Handles application startup (loading PatchCore models for every
available category), static file serving, and route registration.
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import HEATMAP_DIR
from app.api.model_state import load_all_patchcore_models
from app.api.inspection_routes import router as inspection_router
from app.api.history_routes import router as history_router
from app.api.dashboard_routes import router as dashboard_router
from app.api.report_routes import router as report_router
from app.api.category_routes import router as category_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up: loading PatchCore models for all available categories...")
    load_all_patchcore_models()
    yield
    print("Shutting down.")


app = FastAPI(title="Industrial Defect Detection API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static/heatmaps", StaticFiles(directory=str(HEATMAP_DIR)), name="heatmaps")

app.include_router(inspection_router)
app.include_router(history_router)
app.include_router(dashboard_router)
app.include_router(report_router)
app.include_router(category_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
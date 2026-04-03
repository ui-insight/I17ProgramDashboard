"""API v1 router — register all route modules here."""

from fastapi import APIRouter

from app.api.v1 import programs

api_router = APIRouter()


@api_router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


api_router.include_router(programs.router, prefix="/programs", tags=["programs"])

"""API v1 router — register all route modules here."""

from fastapi import APIRouter

api_router = APIRouter()


@api_router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# Register resource routers below:
# from app.api.v1 import users
# api_router.include_router(users.router, prefix="/users", tags=["users"])

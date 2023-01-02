from fastapi import Depends

from sourcerer.core.infrastructure.models import ExtendedPydanticSourceCredentials, PydanticUser
from sourcerer.frameworks.fastapi.v1.routers.base import V1APIRouter
from sourcerer.frameworks.fastapi.v1.config import source_controller
from sourcerer.frameworks.fastapi.v1.services.auth import get_current_user


class RegistrationsAPIRouter(V1APIRouter):
    tags = ['registrations']


router = RegistrationsAPIRouter()


@router.get("/registrations")
async def list_registrations(
        user: PydanticUser = Depends(get_current_user)
):
    """
    Get list of registered credentials
    """
    return source_controller.list_registration(user)


@router.post("/registrations")
async def create_registration(
        source_registration: ExtendedPydanticSourceCredentials,
        user: PydanticUser = Depends(get_current_user)
):
    """
    Get list of registered credentials
    """
    return source_controller.add(source_registration, user)

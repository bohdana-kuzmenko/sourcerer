from fastapi import Depends

from sourcerer.core.infrastructure.models import ExtendedPydanticSourceCredentials, PydanticUser
from sourcerer.frameworks.fastapi.v1.routers.base import V1APIRouter
from sourcerer.frameworks.fastapi.v1.config import source_controller
from sourcerer.frameworks.fastapi.v1.services.auth import get_current_user


class RegistrationsAPIRouter(V1APIRouter):
    tags = ['registrations']


router = RegistrationsAPIRouter()


@router.get("/registrations")
def list_registrations(
        user: PydanticUser = Depends(get_current_user)
):
    """
    Get list of registered credentials
    """
    return source_controller.list_registration(user)


@router.get("/registrations/{registration_id}/activate")
def list_registrations(
        registration_id: int,
        user: PydanticUser = Depends(get_current_user)

):
    """
    Get list of registered credentials
    """
    return source_controller.activate_registration(user, registration_id)


@router.get("/registrations/{registration_id}/deactivate")
def list_registrations(
        registration_id: int,
        user: PydanticUser = Depends(get_current_user)

):
    """
    Get list of registered credentials
    """
    return source_controller.deactivate_registration(user, registration_id)


@router.post("/registrations")
def create_registration(
        source_registration: ExtendedPydanticSourceCredentials,
        user: PydanticUser = Depends(get_current_user)
):
    """
    Get list of registered credentials
    """
    return source_controller.add(source_registration, user)

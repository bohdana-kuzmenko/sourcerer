from fastapi import Depends

from sourcerer.core.infrastucture.data_provider_credentials.models import ExtendedPydanticDataProviderCredentials
from sourcerer.core.infrastucture.user.models import PydanticUser
from sourcerer.frameworks.fastapi.v1.routers.base import V1APIRouter
from sourcerer.frameworks.fastapi.v1.config import credentials_controller
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
    return credentials_controller.list(user)


@router.get("/registrations/{registration_id}/activate")
def list_registrations(
        registration_id: int,
        user: PydanticUser = Depends(get_current_user)

):
    """
    Get list of registered credentials
    """
    return credentials_controller.activate(user, registration_id)


@router.get("/registrations/{registration_id}/deactivate")
def list_registrations(
        registration_id: int,
        user: PydanticUser = Depends(get_current_user)

):
    """
    Get list of registered credentials
    """
    return credentials_controller.deactivate(user, registration_id)


@router.post("/registrations")
def create_registration(
        source_registration: ExtendedPydanticDataProviderCredentials,
        user: PydanticUser = Depends(get_current_user)
):
    """
    Get list of registered credentials
    """
    return credentials_controller.add(source_registration, user)

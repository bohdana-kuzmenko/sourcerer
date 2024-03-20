from fastapi import Depends

from sourcerer.core.infrastucture.data_provider_credentials.models import ExtendedPydanticDataProviderCredentials
from sourcerer.core.infrastucture.storage_registration.models import ExtendedPydanticStorageRegistration
from sourcerer.core.infrastucture.user.models import PydanticUser
from sourcerer.frameworks.fastapi.v1.config import credentials_controller, storages_registration_controller
from sourcerer.frameworks.fastapi.v1.routers.base import V1APIRouter
from sourcerer.frameworks.fastapi.v1.services.auth import get_current_user


class RegistrationsAPIRouter(V1APIRouter):
    tags = ['registrations']


router = RegistrationsAPIRouter(prefix='/registrations')


@router.get("/credentials")
def list_credentials(
        user: PydanticUser = Depends(get_current_user)
):
    """
    Get list of registered credentials
    """
    return credentials_controller.list(user)


@router.get("/credentials/{registration_id}/activate")
def list_credentials(
        registration_id: int,
        user: PydanticUser = Depends(get_current_user)

):
    """
    Get list of registered credentials
    """
    return credentials_controller.activate(user, registration_id)


@router.get("/credentials/{registration_id}/deactivate")
def list_credentials(
        registration_id: int,
        user: PydanticUser = Depends(get_current_user)

):
    """
    Get list of registered credentials
    """
    return credentials_controller.deactivate(user, registration_id)


@router.post("/credentials")
def create_registration(
        source_registration: ExtendedPydanticDataProviderCredentials,
        user: PydanticUser = Depends(get_current_user)
):
    """
    Get list of registered credentials
    """
    return credentials_controller.add(source_registration, user)


@router.get("/storages")
def get_registered_storages(
        user: PydanticUser = Depends(get_current_user)
):
    """
    Get list of registered credentials
    """
    return storages_registration_controller.list(user)


@router.post("/storages")
def create_registered_storages(
        storage: ExtendedPydanticStorageRegistration,
        user: PydanticUser = Depends(get_current_user)
):
    """
    Get list of registered credentials
    """
    return storages_registration_controller.add(storage, user)


@router.delete("/storages/{storage_id}")
def delete_registered_storages(
        storage_id: int,
        user: PydanticUser = Depends(get_current_user),
):
    """
    Get list of registered credentials
    """
    return storages_registration_controller.delete(storage_id)

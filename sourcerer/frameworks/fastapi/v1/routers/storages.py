import time

from fastapi import Depends
from starlette.responses import RedirectResponse

from sourcerer.core.infrastructure.models import PydanticUser
from sourcerer.frameworks.fastapi.v1.routers.base import V1APIRouter
from sourcerer.frameworks.fastapi.v1.config import source_controller
from sourcerer.frameworks.fastapi.v1.routers.users import get_current_user


class StoragesAPIRouter(V1APIRouter):
    tags = ['storages']


router = StoragesAPIRouter()


@router.get("/storages")
async def storages(
        user: PydanticUser = Depends(get_current_user)
):
    """
    Get list of available storages
    :return:
    """
    return source_controller.list_sources(None, user)


@router.get("/registrations/{registration_id}/storages")
async def storages(registration_id):
    """
    Get list of available storages
    :return:
    """
    return source_controller.list_sources(registration_id)


@router.get("/registrations/{registration_id}/storages/{storage_name}")
async def storages(registration_id, storage_name, path: str = ""):
    """
    Get list of available storages for credentials registration
    :return:
    """
    return source_controller.list_source_content(registration_id, storage_name, path)


@router.get("/registrations/{registration_id}/storages/{storage_name}/permissions")
async def storages(registration_id, storage_name):
    """
    List storage permissions
    :return:
    """
    return source_controller.get_storage_permissions(registration_id, storage_name)


@router.get("/registrations/{registration_id}/storages/{storage_name}/download_url")
async def get_download_url(registration_id, storage_name, path: str = ""):
    """
    :param registration_id:
    :param storage_name:
    :param path:
    :return:
    """
    return source_controller.get_download_url(registration_id, storage_name, path)


@router.get("/registrations/{registration_id}/storages/{storage_name}/preview")
async def preview(registration_id, storage_name, path: str = ""):
    """
    :param registration_id:
    :param storage_name:
    :param path:
    :return:
    """
    return source_controller.preview_data(registration_id, storage_name, path)

from fastapi import Depends
from fastapi import UploadFile
from sourcerer.core.infrastucture.user.models import PydanticUser
from sourcerer.frameworks.fastapi.v1.routers.base import V1APIRouter
from sourcerer.frameworks.fastapi.v1.config import storages_controller
from sourcerer.frameworks.fastapi.v1.routers.users import get_current_user


class StoragesAPIRouter(V1APIRouter):
    tags = ['storages']


router = StoragesAPIRouter()


@router.get("/storages")
def storages(
        user: PydanticUser = Depends(get_current_user)
):
    """
    Get list of available storages
    :return:
    """
    return storages_controller.list_storages(user, None)


@router.get("/registrations/credentials/{registration_id}/storages")
def storages(registration_id, user: PydanticUser = Depends(get_current_user)):
    """
    Get list of available storages
    :return:
    """
    return storages_controller.list_storages(user, registration_id)


@router.get("/registrations/credentials/{registration_id}/storages/{storage_name}")
def storage_content(registration_id, storage_name, path: str = "", prefix: str = "",user: PydanticUser = Depends(get_current_user)):
    """
    Get list of available storages for credentials registration
    :return:
    """
    return storages_controller.list_storage_content(user, registration_id, storage_name, path, prefix)


@router.get("/registrations/credentials/{registration_id}/storages/{storage_name}/permissions")
def storage_permissions(registration_id, storage_name, user: PydanticUser = Depends(get_current_user)):
    """
    List storage permissions
    :return:
    """
    return storages_controller.get_storage_permissions(user, registration_id, storage_name)


@router.get("/registrations/credentials/{registration_id}/storages/{storage_name}/download_url")
def get_download_url(registration_id, storage_name, path: str = "", user: PydanticUser = Depends(get_current_user)):
    """
    :param registration_id:
    :param storage_name:
    :param path:
    :return:
    """
    return storages_controller.get_download_url(user, registration_id, storage_name, path)

@router.post("/registrations/credentials/{registration_id}/storages/{storage_name}/upload")
def upload_file(
        registration_id,
        storage_name,
        path: str,
        file: UploadFile,
        user: PydanticUser = Depends(get_current_user)):
    """
    :param registration_id:
    :param storage_name:
    :param path:
    :return:
    """
    return storages_controller.upload(user, registration_id, storage_name, path, file)


@router.delete("/registrations/credentials/{registration_id}/storages/{storage_name}")
def delete_key(registration_id, storage_name, path: str = "", user: PydanticUser = Depends(get_current_user)):
    """
    :param registration_id:
    :param storage_name:
    :param path:
    :return:
    """
    return storages_controller.delete_key(user, registration_id, storage_name, path)


@router.get("/registrations/credentials/{registration_id}/storages/{storage_name}/preview")
def preview(registration_id, storage_name, path: str = "", user: PydanticUser = Depends(get_current_user)):
    """
    :param registration_id:
    :param storage_name:
    :param path:
    :return:
    """
    return storages_controller.preview_data(user, registration_id, storage_name, path)

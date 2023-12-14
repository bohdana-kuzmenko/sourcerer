import abc

from sourcerer.core.domain.services import BaseService


class BaseDataProviderService(BaseService):
    @classmethod
    def kind(cls):
        raise NotImplementedError

    @classmethod
    def create(cls, params, owner, registered_source_service):
        raise NotImplementedError

    @abc.abstractmethod
    def parse_credentials(self, credentials):
        raise NotImplementedError

    @abc.abstractmethod
    def list_storages(self):
        raise NotImplementedError

    @abc.abstractmethod
    def list_storage_items(self, storage: str, path: str, prefix: str):
        raise NotImplementedError

    @abc.abstractmethod
    def get_storage_permissions(self, storage: str):
        raise NotImplementedError

    @abc.abstractmethod
    def get_storage_metadata(self, storage: str):
        raise NotImplementedError

    @abc.abstractmethod
    def read_storage_item(self, storage: str, key: str):
        raise NotImplementedError

    @abc.abstractmethod
    def put_storage_item(self):
        raise NotImplementedError

    @abc.abstractmethod
    def delete_storage_item(self, storage: str, key: str):
        raise NotImplementedError

    @abc.abstractmethod
    def get_download_url(self, storage: str, key: str, expiration: int = 600):
        raise NotImplementedError

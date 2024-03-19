import abc

from sourcerer.core.domain.services import BaseService


class BaseStorageRegistrationService(BaseService):

    @abc.abstractmethod
    def list(self, credentials):
        raise NotImplementedError

    @abc.abstractmethod
    def create(self, storage):
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, storage_id):
        raise NotImplementedError

from sourcerer.core.domain.data_provider.entities import DataProviderRegistry
from sourcerer.core.domain.storage_registration.services import BaseStorageRegistrationService

from sourcerer.core.infrastucture.data_provider_credentials.models import PydanticDataProviderCredentials
from sourcerer.core.infrastucture.data_provider_credentials.services import DataProviderCredentialsService
from sourcerer.core.infrastucture.storage_registration.models import PydanticStorageRegistration
from sourcerer.core.infrastucture.user.models import PydanticUser


class StorageRegistrationController:
    def __init__(
            self,
            storage_registration_service: BaseStorageRegistrationService,
            data_provider_credentials_service: DataProviderCredentialsService
    ):
        self.storage_registration_service = storage_registration_service
        self.data_provider_credentials_service = data_provider_credentials_service

    def add(self, storage: PydanticStorageRegistration, user: PydanticUser):
        self.storage_registration_service.create(storage)

    def delete(self, storage_id):
        return self.storage_registration_service.delete(storage_id)

    def list(self, user):
        credentials = self.data_provider_credentials_service.list(owner=user.id, exclude_inactive=True)
        return self.storage_registration_service.list(credentials)

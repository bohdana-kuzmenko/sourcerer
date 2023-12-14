from sourcerer.core.domain.data_provider.entities import DataProviderRegistry

from sourcerer.core.infrastucture.data_provider_credentials.models import PydanticDataProviderCredentials
from sourcerer.core.infrastucture.data_provider_credentials.services import DataProviderCredentialsService
from sourcerer.core.infrastucture.data_provider_credentials.utils import StorageConfigurationErrorHandler
from sourcerer.core.infrastucture.user.models import PydanticUser


class DataProviderCredentialsController:
    def __init__(self, service: DataProviderCredentialsService):
        self.service = service

    def add(self, params: PydanticDataProviderCredentials, user: PydanticUser):
        if "provider" not in params.dict():
            return "fail"
        DataProviderRegistry().get(params.provider).create(params.dict(), user, self.service)

    def list(self, user):
        return self.service.list(user.id, exclude_inactive=False)

    def activate(self, user, registration_id):
        registration = self.service.get(registration_id, return_raw_entity=True)
        # ToDo: check user
        return self.service.activate(registration)

    def deactivate(self, user, registration_id):
        registration = self.service.get(registration_id, return_raw_entity=True)
        return self.service.deactivate(registration)

    def list_storages(self, source_id: int = None, user: PydanticUser = None):
        if source_id:
            # todo: add check for ownership
            sources = [self.service.get(source_id)]
        else:
            sources = self.service.list(user.id)

        result = []
        for source in sources:
            with StorageConfigurationErrorHandler():
                remote_service = DataProviderRegistry().get(source.provider)(
                    source.credentials.decode("utf-8")
                )
                result.extend([{**i, "registration_id": source.id} for i in remote_service.list_storages()])

        return result

    def list_storage_content(self, source_id: int, bucket: str, path: str = "", prefix: str = ""):
        source = self.service.get(source_id)
        data_provider_service = DataProviderRegistry().get(source.provider)(
            source.credentials.decode("utf-8")
        )
        return data_provider_service.list_storage_items(bucket, path, prefix)

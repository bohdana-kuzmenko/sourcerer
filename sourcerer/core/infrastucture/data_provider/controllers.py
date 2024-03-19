from sourcerer.core.domain.data_provider.entities import DataProviderRegistry
from sourcerer.core.infrastucture.data_provider_credentials.services import DataProviderCredentialsService
from sourcerer.core.infrastucture.data_provider_credentials.utils import StorageConfigurationErrorHandler
from sourcerer.core.infrastucture.storage_registration.services import StorageRegistrationService
from sourcerer.core.infrastucture.user.models import PydanticUser


class DataProviderController:

    def __init__(
            self,
            data_provider_credentials_service: DataProviderCredentialsService,
            storage_registration_service: StorageRegistrationService,
    ):
        self.data_provider_credentials_service = data_provider_credentials_service
        self.storage_registration_service = storage_registration_service

    def _get_data_provider_service_by_credentials_id(self, id):
        data_provider_credentials = self.data_provider_credentials_service.get(id)
        return DataProviderRegistry().get(data_provider_credentials.provider)(
            data_provider_credentials.credentials.decode("utf-8")
        )

    def get_storage_permissions(self, data_provider_credentials_id, bucket):
        data_provider_service = self._get_data_provider_service_by_credentials_id(data_provider_credentials_id)
        return data_provider_service.get_storage_permissions(bucket)

    def get_storage_metadata(self, data_provider_credentials_id, bucket):
        data_provider_service = self._get_data_provider_service_by_credentials_id(data_provider_credentials_id)
        return data_provider_service.get_storage_metadata(bucket)

    def get_download_url(self, data_provider_credentials_id, bucket, key):
        data_provider_service = self._get_data_provider_service_by_credentials_id(data_provider_credentials_id)
        return data_provider_service.get_download_url(bucket, key)

    def upload(self, data_provider_credentials_id, bucket, path, file):
        data_provider_service = self._get_data_provider_service_by_credentials_id(data_provider_credentials_id)
        return data_provider_service.upload(bucket, path, file)

    def preview_data(self, data_provider_credentials_id, bucket, key):
        data_provider_service = self._get_data_provider_service_by_credentials_id(data_provider_credentials_id)
        return data_provider_service.read_storage_item(bucket, key)

    def delete_key(self, data_provider_credentials_id, bucket, key):
        data_provider_service = self._get_data_provider_service_by_credentials_id(data_provider_credentials_id)
        return data_provider_service.delete_storage_item(bucket, key)

    def list_storages(self, data_provider_credentials_id: int = None, user: PydanticUser = None):
        if data_provider_credentials_id:
            # todo: add check for ownership
            sources = [self.data_provider_credentials_service.get(data_provider_credentials_id)]
        else:
            sources = self.data_provider_credentials_service.list(user.id)

        result = []
        for source in sources:
            with StorageConfigurationErrorHandler():
                data_provider_service = self._get_data_provider_service_by_credentials_id(source.id)
                result.extend([{**i, "registration_id": source.id} for i in data_provider_service.list_storages()])
                result.extend([{
                    'cloud': '',
                    'date_created': '1970-01-01T00:00:00+00:00',
                    'storage': i.name,
                    'registration_id': source.id} for i in self.storage_registration_service.list([source])])

        return result

    def list_storage_content(self, data_provider_credentials_id: int, bucket: str, path: str = "", prefix: str = ""):
        data_provider_service = self._get_data_provider_service_by_credentials_id(data_provider_credentials_id)
        return data_provider_service.list_storage_items(bucket, path, prefix)

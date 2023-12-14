from sourcerer.core.domain.data_provider.entities import DataProviderRegistry
from sourcerer.core.infrastucture.data_provider_credentials.services import DataProviderCredentialsService


class DataProviderController:

    def __init__(self, service: DataProviderCredentialsService):
        self.service = service

    def _get_data_provider_service_by_credentials_id(self, id):
        data_provider_credentials = self.service.get(id)
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

    def preview_data(self, data_provider_credentials_id, bucket, key):
        data_provider_service = self._get_data_provider_service_by_credentials_id(data_provider_credentials_id)
        return data_provider_service.read_storage_item(bucket, key)

    def delete_key(self, data_provider_credentials_id, bucket, key):
        data_provider_service = self._get_data_provider_service_by_credentials_id(data_provider_credentials_id)
        return data_provider_service.delete_storage_item(bucket, key)

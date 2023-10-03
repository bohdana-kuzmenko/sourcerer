from sourcerer.core.domain.entities import StoragesRegistry
from sourcerer.core.infrastructure.models import PydanticSourceCredentials, PydanticUser
from sourcerer.core.infrastructure.services.credentials import RegisteredCredentialsService


class StoragesController:

    def __init__(self, service: RegisteredCredentialsService):
        self.service = service

    def get_storage_permissions(self, source_id, bucket):
        source = self.service.get(source_id)
        remote_service = StoragesRegistry().get(source.provider)(
            source.credentials.decode("utf-8")
        )
        return remote_service.get_storage_permissions(bucket)

    def get_storage_metadata(self, source_id, bucket):
        source = self.service.get(source_id)
        remote_service = StoragesRegistry().get(source.provider)(
            source.credentials.decode("utf-8")
        )
        return remote_service.get_storage_metadata(bucket)

    def get_download_url(self, source_id, bucket, key):
        source = self.service.get(source_id)
        remote_service = StoragesRegistry().get(source.provider)(
            source.credentials.decode("utf-8")
        )
        return remote_service.get_download_url(bucket, key)

    def preview_data(self, source_id, bucket, key):
        source = self.service.get(source_id)
        remote_service = StoragesRegistry().get(source.provider)(
            source.credentials.decode("utf-8")
        )
        return remote_service.read_storage_item(bucket, key)

    def delete_key(self, source_id, bucket, key):
        source = self.service.get(source_id)
        remote_service = StoragesRegistry().get(source.provider)(
            source.credentials.decode("utf-8")
        )
        return remote_service.delete_storage_item(bucket, key)

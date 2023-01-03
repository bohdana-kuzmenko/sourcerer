from sourcerer.core.domain.entities import RemoteSourcesRegistry
from sourcerer.core.infrastructure.exceptions import SourceAccessError, BLOBBYConfigurationError
from sourcerer.core.infrastructure.models import PydanticSourceCredentials, PydanticUser
from sourcerer.core.infrastructure.services.locals.source import RegisteredSourcesService


class BlobbyConfigurationErrorHandler:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_val:
            print(exc_type)
            print(exc_val)
            print(exc_tb)
        return True


class SourceController:
    def __init__(self, service: RegisteredSourcesService):
        self.service = service

    def add(self, params: PydanticSourceCredentials, user: PydanticUser):
        if "provider" not in params.dict():
            return "fail"
        RemoteSourcesRegistry().get(params.provider).create(params.dict(), user, self.service)

    def list_registration(self, user):
        return self.service.list(user.id, exclude_inactive=False)

    def list_sources(self, source_id: int = None, user: PydanticUser = None):
        if source_id:
            # todo: add check for ownership
            sources = [self.service.get(source_id)]
        else:
            sources = self.service.list(user.id)

        result = []
        for source in sources:
            with BlobbyConfigurationErrorHandler():
                remote_service = RemoteSourcesRegistry().get(source.provider)(
                    source.credentials.decode("utf-8")
                )
                result.extend([{**i, "registration_id": source.id} for i in remote_service.list_storages()])

        return result

    def list_source_content(self, source_id: int, bucket: str, prefix=None):
        source = self.service.get(source_id)
        remote_service = RemoteSourcesRegistry().get(source.provider)(
            source.credentials.decode("utf-8")
        )
        return remote_service.list_storage_items(bucket, prefix)

    def get_storage_permissions(self, source_id, bucket):
        source = self.service.get(source_id)
        remote_service = RemoteSourcesRegistry().get(source.provider)(
            source.credentials.decode("utf-8")
        )
        return remote_service.get_storage_permissions(bucket)

    def get_storage_metadata(self, source_id, bucket):
        source = self.service.get(source_id)
        remote_service = RemoteSourcesRegistry().get(source.provider)(
            source.credentials.decode("utf-8")
        )
        return remote_service.get_storage_metadata(bucket)

    def get_download_url(self, source_id, bucket, key):
        source = self.service.get(source_id)
        remote_service = RemoteSourcesRegistry().get(source.provider)(
            source.credentials.decode("utf-8")
        )
        return remote_service.get_download_url(bucket, key)

    def preview_data(self, source_id, bucket, key):
        source = self.service.get(source_id)
        remote_service = RemoteSourcesRegistry().get(source.provider)(
            source.credentials.decode("utf-8")
        )
        return remote_service.read_storage_item(bucket, key)

    def download_data(self, source_id, bucket, key):
        pass
        # source = self.service.get(source_id)
        #
        # remote_service = RemoteSourcesRegistry().get(source.provider)(
        #     source.credentials
        # )
        # return remote_service.get

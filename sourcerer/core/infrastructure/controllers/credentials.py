from sourcerer.core.domain.entities import StoragesRegistry
from sourcerer.core.infrastructure.models import PydanticSourceCredentials, PydanticUser
from sourcerer.core.infrastructure.services.credentials import RegisteredCredentialsService


class StorageConfigurationErrorHandler:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_val:
            print(exc_type)
            print(exc_val)
            print(exc_tb)
        return True


class CredentialsController:
    def __init__(self, service: RegisteredCredentialsService):
        self.service = service

    def add(self, params: PydanticSourceCredentials, user: PydanticUser):
        if "provider" not in params.dict():
            return "fail"
        StoragesRegistry().get(params.provider).create(params.dict(), user, self.service)

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
                remote_service = StoragesRegistry().get(source.provider)(
                    source.credentials.decode("utf-8")
                )
                result.extend([{**i, "registration_id": source.id} for i in remote_service.list_storages()])

        return result

    def list_storage_content(self, source_id: int, bucket: str, path: str = "", prefix: str = ""):
        source = self.service.get(source_id)
        remote_service = StoragesRegistry().get(source.provider)(
            source.credentials.decode("utf-8")
        )
        return remote_service.list_storage_items(bucket, path, prefix)

from sourcerer.core.domain.data_provider.entities import DataProviderRegistry
from sourcerer.core.infrastucture.data_provider_credentials.exceptions import RegistrationIsNotFoundException, \
    RegistrationAccessDeniedException

from sourcerer.core.infrastucture.data_provider_credentials.models import PydanticDataProviderCredentials
from sourcerer.core.infrastucture.data_provider_credentials.services import DataProviderCredentialsService
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
        self.service.verify_user_access(registration_id, user.id)
        registration = self.service.get(registration_id, return_raw_entity=True)
        return self.service.activate(registration)

    def deactivate(self, user, registration_id):
        self.service.verify_user_access(registration_id, user.id)
        registration = self.service.get(registration_id, return_raw_entity=True)
        return self.service.deactivate(registration)

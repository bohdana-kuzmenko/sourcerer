from sourcerer.core.domain.data_provider_credentials.services import BaseDataProviderCredentialService
from sourcerer.core.infrastucture.data_provider.exceptions import SourceNotFoundException
from sourcerer.core.infrastucture.data_provider_credentials.exceptions import RegistrationAccessDeniedException
from sourcerer.core.infrastucture.data_provider_credentials.models import PydanticDataProviderCredentials, Credentials


class DataProviderCredentialsService(BaseDataProviderCredentialService):
    def __init__(self, db):
        self.db = db

    def list(self, owner, exclude_inactive=True):

        filter_list = [
            Credentials.owner_id == owner,
        ]

        if exclude_inactive:
            filter_list.append(Credentials.active == True)

        return [
            PydanticDataProviderCredentials.from_orm(i)
            for i in self.db.query(Credentials).filter(*filter_list).all()
        ]

    def get(self, id, return_raw_entity=False):
        data_source_credentials = self.db.query(Credentials).filter_by(id=id).first()
        if not data_source_credentials:
            raise SourceNotFoundException(id)
        return (
            data_source_credentials
            if return_raw_entity else
            PydanticDataProviderCredentials.from_orm(data_source_credentials)
        )

    def create(self, credentials):
        try:
            self.db.add(credentials)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

    def activate(self, registration):
        registration.active = True
        self.db.commit()

    def deactivate(self, registration):
        registration.active = False
        self.db.commit()

    def update(self):
        pass

    def delete(self):
        pass

    def verify_user_access(self, credentials_id, user_id):
        registration = self.get(credentials_id, return_raw_entity=True)
        if registration.owner_id != user_id:
            raise RegistrationAccessDeniedException

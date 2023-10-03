from sourcerer.core.domain.exceptions import SourcerBaseException
from sourcerer.core.domain.services import BaseService
from sourcerer.core.infrastructure.models import (
    PydanticSourceCredentials,
    Credentials,
)


class SourceNotFoundException(SourcerBaseException):
    pass


class RegisteredCredentialsService(BaseService):
    def __init__(self, db):
        self.db = db

    def list(self, owner, exclude_inactive=True):

        filter_list = [
            Credentials.owner_id == owner,
        ]

        if exclude_inactive:
            filter_list.append(Credentials.active == True)

        return [
            PydanticSourceCredentials.from_orm(i)
            for i in self.db.query(Credentials).filter(*filter_list).all()
        ]

    def get(self, id, return_raw_entity=False):
        source = self.db.query(Credentials).filter_by(id=id).first()
        if not source:
            raise SourceNotFoundException(id)
        return source if return_raw_entity else PydanticSourceCredentials.from_orm(source)

    def create(self, source: Credentials):
        self.db.add(source)
        self.db.commit()

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

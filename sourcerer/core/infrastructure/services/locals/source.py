from sourcerer.core.domain.exceptions import SourcerBaseException
from sourcerer.core.domain.services import BaseService
from sourcerer.core.infrastructure.models import (
    PydanticSourceCredentials,
    SourceCredentials,
)


class SourceNotFoundException(SourcerBaseException):
    pass


class RegisteredSourcesService(BaseService):
    def __init__(self, db):
        self.db = db

    def list(self, owner, exclude_inactive=True):

        filter_list = [
            SourceCredentials.owner_id == owner,
        ]

        if exclude_inactive:
            filter_list.append(SourceCredentials.active == True)

        return [
            PydanticSourceCredentials.from_orm(i)
            for i in self.db.query(SourceCredentials).filter(*filter_list).all()
        ]

    def get(self, id):
        source = self.db.query(SourceCredentials).filter_by(id=id).first()
        if not source:
            raise SourceNotFoundException(id)
        return PydanticSourceCredentials.from_orm(source)

    def create(self, source: SourceCredentials):
        self.db.add(source)
        self.db.commit()

    def update(self):
        pass

    def delete(self):
        pass

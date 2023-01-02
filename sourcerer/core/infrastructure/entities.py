from pydantic import BaseModel

from sourcerer.core.config.db import db
from sourcerer.core.domain.entities import BaseSource, BaseEntity
from sourcerer.core.infrastructure.models import (
    PydanticSourceCredentials,
    SourceCredentials,
)


class User(BaseEntity):
    def register(
        self,
    ):
        raise NotImplemented

    def update(self):
        raise NotImplemented

    def delete(self):
        raise NotImplemented


class BlobbySource(BaseSource):
    @property
    def kind(self):
        return "BLOBBY"

    def register(self, entity: BaseModel):
        db_source = SourceCredentials(**entity.dict())
        db.add(db_source)
        db.commit()

    def update(self):
        raise NotImplemented

    def delete(self):
        raise NotImplemented

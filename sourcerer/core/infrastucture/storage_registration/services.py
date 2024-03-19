from sourcerer.core.domain.storage_registration.services import BaseStorageRegistrationService
from sourcerer.core.infrastucture.storage_registration.models import StorageRegistration, PydanticStorageRegistration


class StorageRegistrationService(BaseStorageRegistrationService):
    def __init__(self, db):
        self.db = db

    def list(self, credentials):
        result = (self.db.query(
            StorageRegistration
        ).filter(
            StorageRegistration.credentials_id.in_([c.id for c in credentials])
        ).all())

        return [PydanticStorageRegistration.from_orm(i) for i in result]

    def create(self, storage):
        source = StorageRegistration(
            name=storage.name,
            credentials_id=storage.credentials_id
        )
        self.db.add(source)
        self.db.commit()

    def delete(self, storage_id):
        storage = self.db.get(StorageRegistration, storage_id)
        self.db.delete(storage)
        self.db.commit()

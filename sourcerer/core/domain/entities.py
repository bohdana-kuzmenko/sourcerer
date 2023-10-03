from sourcerer.core.domain.services import BaseStorageService


class BaseEntity:
    """Base class for Entities."""

    pass


class BaseSource(BaseEntity):
    pass


class StoragesRegistry(dict):
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(StoragesRegistry, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def register(self, service: BaseStorageService):
        self[service.kind()] = service

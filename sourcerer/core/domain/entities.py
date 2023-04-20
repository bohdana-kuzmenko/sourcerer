from sourcerer.core.domain.services import BaseRemoteService


class BaseEntity:
    """Base class for Entities."""

    pass


class BaseSource(BaseEntity):
    pass


class RemoteSourcesRegistry(dict):
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(RemoteSourcesRegistry, cls).__new__(
                cls, *args, **kwargs
            )
        return cls._instance

    def register(self, service: BaseRemoteService):
        self[service.kind()] = service

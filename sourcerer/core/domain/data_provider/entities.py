from sourcerer.core.domain.data_provider.services import BaseDataProviderService


class DataProviderRegistry(dict):
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(DataProviderRegistry, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def register(self, service: BaseDataProviderService):
        self[service.kind()] = service

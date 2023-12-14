from sourcerer.core.domain.data_provider.entities import DataProviderRegistry
from sourcerer.core.infrastucture.data_provider.services import BlobbyService, McQueenService

DataProviderRegistry().register(BlobbyService)
DataProviderRegistry().register(McQueenService)

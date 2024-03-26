from sourcerer.core.domain.data_provider.entities import DataProviderRegistry
from sourcerer.core.infrastucture.data_provider.services import BlobbyService, McQueenService, Conductor

DataProviderRegistry().register(BlobbyService)
DataProviderRegistry().register(McQueenService)
DataProviderRegistry().register(Conductor)

from sourcerer.core.domain.entities import StoragesRegistry
from sourcerer.core.infrastructure.services.storages.apple_s3 import AppleS3Service
from sourcerer.core.infrastructure.services.storages.blobby import BlobbyService
from sourcerer.core.infrastructure.services.storages.mcqueen import McQueenService

StoragesRegistry().register(AppleS3Service)
StoragesRegistry().register(BlobbyService)
StoragesRegistry().register(McQueenService)

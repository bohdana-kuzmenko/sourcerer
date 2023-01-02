from sourcerer.core.domain.entities import RemoteSourcesRegistry
from sourcerer.core.infrastructure.services.remotes.apple_s3 import AppleS3RemoteService
from sourcerer.core.infrastructure.services.remotes.blobby import BlobbyRemoteService

RemoteSourcesRegistry().register(AppleS3RemoteService)
RemoteSourcesRegistry().register(BlobbyRemoteService)

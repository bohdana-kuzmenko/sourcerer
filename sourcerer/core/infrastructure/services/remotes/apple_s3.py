from sourcerer.core.domain.services import BaseRemoteService
import boto3

from sourcerer.core.infrastructure.models import SourceCredentials, SourceProvidersEnum


class AppleS3RemoteService(BaseRemoteService):

    def __init__(self, credentials):
        aws_access_key_id, aws_secret_access_key, endpoint_url = self.parse_credentials(
            credentials
        )
        self.session = boto3.Session(
            aws_secret_access_key=aws_secret_access_key,
            aws_access_key_id=aws_access_key_id,
        )
        self.client = self.session.client("s3", endpoint_url=endpoint_url, verify=False)
        self.resource = self.session.resource(
            "s3", endpoint_url=endpoint_url, verify=False
        )

    @classmethod
    def kind(cls):
        return SourceProvidersEnum.blobby

    @classmethod
    def create(cls, params, registered_source_service):
        source = SourceCredentials(
            provider=cls.kind(),
            credentials=" ".join(
                [
                    params.get("aws_secret_access_key", ""),
                    params.get("aws_access_key_id", ""),
                    params.get("endpoint_url", "https://blob.mr3.simcloud.apple.com"),
                ]
            ),
        )
        registered_source_service.create(source)

    def parse_credentials(self, credentials):
        aws_secret_access_key, aws_access_key_id, endpoint_url = credentials.split()
        return aws_access_key_id, aws_secret_access_key, endpoint_url

    def list_storages(self):
        response = self.client.list_buckets()
        return [i.get("Name") for i in response.get("Buckets")]

    def list_storage_items(self, storage: SourceCredentials, prefix: str):
        pass

    def read_storage_item(self):
        pass

    def put_storage_item(self):
        pass

    def delete_storage_item(self):
        pass

    def get_storage_permissions(self, storage: str):
        pass

    def get_storage_metadata(self, storage: str):
        pass

    def get_download_url(self, storage: str, key: str, expiration: int):
        pass


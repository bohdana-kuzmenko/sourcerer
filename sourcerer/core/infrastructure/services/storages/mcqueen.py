import boto3

from sourcerer.core.infrastructure.exceptions import BLOBBYConfigurationError
from sourcerer.core.infrastructure.models import Credentials, SourceProvidersEnum
from sourcerer.core.infrastructure.services.storages.s3_compatible_base import S3CompatibleBase

ENDPOINT_URL = "https://store-030.blobstore.apple.com"
REGION = "store-030"


def add_xml_header(params, **kwargs):
    params['headers']['Accept'] = 'application/xml'


class McQueenService(S3CompatibleBase):
    def __init__(self, credentials):
        aws_access_key_id, aws_secret_access_key, endpoint_url, region = self.parse_credentials(
            credentials
        )
        self.mcqueen_endpoint = ENDPOINT_URL
        self.mcqueen_region = REGION
        self.aws_secret_access_key = aws_secret_access_key
        self.aws_access_key_id = aws_access_key_id
        self.session = boto3.Session(

            aws_secret_access_key=aws_secret_access_key,
            aws_access_key_id=aws_access_key_id,
        )
        try:
            self._client = self.session.client("s3", endpoint_url=endpoint_url, region_name=region, verify=False)
            self._resource = self.session.resource(
                "s3", endpoint_url=endpoint_url, region_name=region, verify=False
            )
            self.client.meta.events.register('before-call.s3.ListObjects', add_xml_header)

        except Exception as ex:
            raise BLOBBYConfigurationError(ex)

    @property
    def client(self):
        return self._client

    @property
    def resource(self):
        return self._resource

    @classmethod
    def kind(cls):
        return SourceProvidersEnum.mcqueen

    @classmethod
    def create(cls, params, owner, registered_source_service):
        credentials: dict = params.get('credentials')
        source = Credentials(
            provider=cls.kind(),
            credentials=" ".join(
                [
                    credentials.get("secret_access_key", ""),
                    credentials.get("access_key", ""),
                    credentials.get("endpoint_url", ENDPOINT_URL),
                    credentials.get("region", REGION),
                ]
            ),
            owner_id=owner.id,
            active=True,
        )
        registered_source_service.create(source)

    def parse_credentials(self, credentials):
        aws_secret_access_key, aws_access_key_id, endpoint_url, region = credentials.split()
        return aws_access_key_id, aws_secret_access_key, endpoint_url, region

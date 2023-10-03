import requests
from botocore.config import Config

import boto3
import xml.etree.ElementTree as et

from sourcerer.core.infrastructure.exceptions import BLOBBYConfigurationError
from sourcerer.core.infrastructure.models import Credentials, SourceProvidersEnum
from sourcerer.core.infrastructure.services.storages.s3_compatible_base import S3CompatibleBase

ENDPOINT_URL = "https://blob.mr3.simcloud.apple.com"


class BlobbyService(S3CompatibleBase):

    def __init__(self, credentials):
        aws_access_key_id, aws_secret_access_key, endpoint_url = self.parse_credentials(
            credentials
        )
        self.blobby_endpoint = ENDPOINT_URL
        self.aws_secret_access_key = aws_secret_access_key
        self.aws_access_key_id = aws_access_key_id
        self.session = boto3.Session(
            aws_secret_access_key=aws_secret_access_key,
            aws_access_key_id=aws_access_key_id,
        )
        try:
            self._client = self.session.client("s3", endpoint_url=endpoint_url, verify=False)
            self._resource = self.session.resource(
                "s3", endpoint_url=endpoint_url, verify=False
            )
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
        return SourceProvidersEnum.blobby

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
                ]
            ),
            owner_id=owner.id,
            active=True,
        )
        registered_source_service.create(source)

    def generate_tmp_session(self, storage, key):
        expiration = 600

        prefix = "{}/{}".format(storage, key)
        response = requests.get(self.blobby_endpoint,
                                params={"temp_credentials": 0, "expiry": expiration, "prefix": prefix},
                                headers={"X-AccessKey": self.aws_access_key_id}, verify=False)
        root = et.fromstring(response.content)
        temp_key_id = root.find("AccessKeyId").text
        temp_secret = root.find("SecretAccessKey").text

        return boto3.Session(
            aws_access_key_id=temp_key_id,
            aws_secret_access_key=temp_secret)

    def parse_credentials(self, credentials):
        aws_secret_access_key, aws_access_key_id, endpoint_url = credentials.split()
        return aws_access_key_id, aws_secret_access_key, endpoint_url

    def get_download_url(self, storage: str, key: str, expiration: int = 600):
        session = self.generate_tmp_session(storage, key)
        blobby_config = Config(read_timeout=300)

        blobby = session.client('s3', endpoint_url=self.blobby_endpoint, config=blobby_config)
        return blobby.generate_presigned_url('get_object', Params={'Bucket': storage, 'Key': key}, ExpiresIn=expiration)

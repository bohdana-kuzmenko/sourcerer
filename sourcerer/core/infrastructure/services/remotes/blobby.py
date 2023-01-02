from itertools import groupby
import humanize
import requests
from botocore.config import Config

from sourcerer.core.domain.services import BaseRemoteService
import boto3
import xml.etree.ElementTree as et

from sourcerer.core.infrastructure.exceptions import SourceAccessError, BLOBBYConfigurationError
from sourcerer.core.infrastructure.models import SourceCredentials, SourceProvidersEnum
from sourcerer.core.infrastructure.services.locals.source import RegisteredSourcesService

ENDPOINT_URL = "https://blob.mr3.simcloud.apple.com"


class BlobbyRemoteService(BaseRemoteService):
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
            self.client = self.session.client("s3", endpoint_url=endpoint_url, verify=False)
            self.resource = self.session.resource(
                "s3", endpoint_url=endpoint_url, verify=False
            )
        except Exception as ex:
            raise BLOBBYConfigurationError(ex)

    @classmethod
    def kind(cls):
        return SourceProvidersEnum.blobby

    @classmethod
    def create(cls, params, owner, registered_source_service):
        credentials: dict = params.get('credentials')
        source = SourceCredentials(
            provider=cls.kind(),
            credentials=" ".join(
                [
                    credentials.get("secret_access_key", ""),
                    credentials.get("access_key", ""),
                    credentials.get("endpoint_url", "https://blob.mr3.simcloud.apple.com"),
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

    def list_storages(self):
        try:
            response = self.client.list_buckets()
        except Exception as ex:
            raise SourceAccessError(ex)
        # Todo: Add pydantic schema
        return [
            {
                "storage": i.get("Name"),
                "date_created": i.get("CreationDate"),
                "cloud": response.get("Owner").get("DisplayName")
            }
            for i in response.get("Buckets")
        ]

    def list_storage_items(self, storage: str, prefix: str = ""):
        # ToDo: Exception if storage not exists
        try:
            result = self.client.list_objects(Bucket=storage, Prefix=prefix, Delimiter="/")
        except Exception as ex:
            raise SourceAccessError(ex)
        folders = [i.get("Prefix").replace(prefix, '') for i in result.get("CommonPrefixes", [])]
        files = [
            {
                'key': i.get("Key").replace(prefix, ''),
                'date_modified': i.get("LastModified"),
                'size': humanize.naturalsize(i.get("Size")),
            }

            for i in result.get("Contents", [])]
        return {"folders": folders, "files": files}

    def read_storage_item(self, storage: str, key: str):
        try:
            content_object = self.resource.Object(storage, key)
            return content_object.get()['Body'].read().decode('utf-8')
        except Exception as ex:
            raise SourceAccessError(ex)

    def put_storage_item(self):
        pass

    def delete_storage_item(self):
        pass

    def get_download_url(self, storage: str, key: str, expiration: int = 600):
        session = self.generate_tmp_session(storage, key)
        blobby_config = Config(read_timeout=300)

        blobby = session.client('s3', endpoint_url=self.blobby_endpoint, config=blobby_config)
        return blobby.generate_presigned_url('get_object', Params={'Bucket': storage, 'Key': key}, ExpiresIn=expiration)

    def get_storage_permissions(self, storage: str):

        try:
            permissions = self.client.get_bucket_acl(Bucket=storage)
        except Exception as ex:
            raise SourceAccessError(ex)
        return {
            name: [i['Permission'] for i in items]
            for name, items
            in groupby(permissions['Grants'], key=lambda x: x['Grantee']['ID'])}

    def get_storage_metadata(self, storage: str):
        pass

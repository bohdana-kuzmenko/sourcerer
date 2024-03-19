import os.path
import xml.etree.ElementTree as et
from itertools import groupby
from tempfile import NamedTemporaryFile

import boto3
import humanize
import requests
from botocore.config import Config
from starlette.datastructures import UploadFile

from sourcerer.core.domain.data_provider.services import BaseDataProviderService
from sourcerer.core.infrastucture.data_provider.entities import DataProvidersEnum
from sourcerer.core.infrastucture.data_provider.exceptions import DataProviderAccessError, BLOBBYConfigurationError
from sourcerer.core.infrastucture.data_provider.utils import add_xml_header
from sourcerer.core.infrastucture.data_provider_credentials.models import Credentials


class S3Base(BaseDataProviderService):

    @property
    def client(self):
        raise NotImplementedError

    @property
    def resource(self):
        raise NotImplementedError

    @classmethod
    def kind(cls):
        raise NotImplementedError

    @classmethod
    def create(cls, params, owner, registered_source_service):
        raise NotImplementedError

    def parse_credentials(self, credentials):
        raise NotImplementedError

    def list_storages(self):
        try:
            response = self.client.list_buckets()
        except Exception as ex:
            raise DataProviderAccessError(ex)
        # Todo: Add pydantic schema
        result = [
            {
                "storage": i.get("Name"),
                "date_created": i.get("CreationDate"),
                "cloud": response.get("Owner").get("DisplayName")
            }
            for i in response.get("Buckets")
        ]
        return result

    def list_storage_items(self, storage: str, path: str = "", prefix: str = "", start_after=""):
        # ToDo: Exception if storage does not exist
        try:
            result = self.client.list_objects(Bucket=storage, Prefix=path + prefix, Delimiter="/", MaxKeys=1000)
        except Exception as ex:
            raise DataProviderAccessError(ex)
        folders = [i.get("Prefix").replace(path, '') for i in result.get("CommonPrefixes", [])]
        files = [
            {
                'key': i.get("Key").replace(path, ''),
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
            raise DataProviderAccessError(ex)

    def put_storage_item(self):
        pass

    def delete_storage_item(self, storage: str, key: str):
        return self.resource.Object(storage, key).delete()

    def get_download_url(self, storage: str, key: str, expiration: int = 600):
        return self.client.generate_presigned_url(
            'get_object',
            Params={'Bucket': storage, 'Key': key},
            ExpiresIn=expiration
        )

    def upload(self, storage: str, path, file: UploadFile):
        temp = NamedTemporaryFile(delete=False)
        try:
            try:
                contents = file.file.read()
                with temp as f:
                    f.write(contents)
            except Exception:
                raise
            finally:
                file.file.close()
            print(f"Upload file to {storage} {os.path.join(path, file.filename)}")
            self.client.upload_file(temp.name, storage, os.path.join(path, file.filename))
        except Exception:
            raise
        finally:
            os.remove(temp.name)  # Delete temp file
        return {"filename": file.filename}

    def get_storage_permissions(self, storage: str):

        try:
            permissions = self.client.get_bucket_acl(Bucket=storage)
        except Exception as ex:
            raise DataProviderAccessError(ex)
        return {
            name: [i['Permission'] for i in items]
            for name, items
            in groupby(permissions['Grants'], key=lambda x: x['Grantee']['ID'])}

    def get_storage_metadata(self, storage: str):
        pass


class McQueenService(S3Base):
    ENDPOINT_URL = "https://store-030.blobstore.apple.com"
    REGION = "store-030"

    def __init__(self, credentials):
        aws_access_key_id, aws_secret_access_key, region = self.parse_credentials(
            credentials
        )
        self.mcqueen_endpoint = self.ENDPOINT_URL
        self.mcqueen_region = self.REGION
        self.aws_secret_access_key = aws_secret_access_key
        self.aws_access_key_id = aws_access_key_id
        self.session = boto3.Session(

            aws_secret_access_key=aws_secret_access_key,
            aws_access_key_id=aws_access_key_id,
        )
        try:
            self._client = self.session.client(
                "s3", endpoint_url=self.ENDPOINT_URL, region_name=region, verify=False)
            self._resource = self.session.resource(
                "s3", endpoint_url=self.ENDPOINT_URL, region_name=region, verify=False
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
        return DataProvidersEnum.mcqueen

    @classmethod
    def create(cls, params, owner, data_provider_credentials_service):
        credentials: dict = params.get('credentials')
        source = Credentials(
            provider=cls.kind(),
            credentials=" ".join(
                [
                    credentials.get("secret_access_key", ""),
                    credentials.get("access_key", ""),
                    credentials.get("region", cls.REGION),
                ]
            ),
            owner_id=owner.id,
            active=True,
        )
        data_provider_credentials_service.create(source)

    def parse_credentials(self, credentials):
        aws_secret_access_key, aws_access_key_id, region = credentials.split()
        return aws_access_key_id, aws_secret_access_key, region


class BlobbyService(S3Base):
    ENDPOINT_URL = "https://blob.mr3.simcloud.apple.com"

    def __init__(self, credentials):
        aws_access_key_id, aws_secret_access_key = self.parse_credentials(credentials)
        self.blobby_endpoint = self.ENDPOINT_URL
        self.aws_secret_access_key = aws_secret_access_key
        self.aws_access_key_id = aws_access_key_id
        self.session = boto3.Session(
            aws_secret_access_key=aws_secret_access_key,
            aws_access_key_id=aws_access_key_id,
        )
        try:
            self._client = self.session.client("s3", endpoint_url=self.ENDPOINT_URL, verify=False)
            self._resource = self.session.resource(
                "s3", endpoint_url=self.ENDPOINT_URL, verify=False
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
        return DataProvidersEnum.blobby

    @classmethod
    def create(cls, params, owner, data_provider_credentials_service):
        credentials: dict = params.get('credentials')
        source = Credentials(
            provider=cls.kind(),
            credentials=" ".join(
                [
                    credentials.get("secret_access_key", ""),
                    credentials.get("access_key", ""),
                ]
            ),
            owner_id=owner.id,
            active=True,
        )
        data_provider_credentials_service.create(source)

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
        aws_secret_access_key, aws_access_key_id = credentials.split()
        return aws_access_key_id, aws_secret_access_key

    def get_download_url(self, storage: str, key: str, expiration: int = 600):
        session = self.generate_tmp_session(storage, key)
        blobby_config = Config(read_timeout=300)

        blobby = session.client('s3', endpoint_url=self.blobby_endpoint, config=blobby_config)
        return blobby.generate_presigned_url('get_object', Params={'Bucket': storage, 'Key': key}, ExpiresIn=expiration)

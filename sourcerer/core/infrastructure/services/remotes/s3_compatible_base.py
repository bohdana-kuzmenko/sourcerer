from itertools import groupby

import humanize

from sourcerer.core.domain.services import BaseRemoteService
from sourcerer.core.infrastructure.exceptions import SourceAccessError


class S3CompatibleBase(BaseRemoteService):

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
        return self.client.generate_presigned_url('get_object', Params={'Bucket': storage, 'Key': key}, ExpiresIn=expiration)

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

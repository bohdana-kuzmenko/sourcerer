from fastapi import APIRouter


class BaseAPIRouter(APIRouter):
    tags = []

    def __init__(self, *args, **kwargs):
        if "prefix" not in kwargs:
            kwargs["prefix"] = ""
        kwargs["prefix"] = f'/api{kwargs["prefix"]}'
        if "tags" not in kwargs:
            kwargs["tags"] = []
        kwargs["tags"].extend(self.tags)
        super().__init__(*args, **kwargs)

from sourcerer.frameworks.fastapi.base import BaseAPIRouter


class V1APIRouter(BaseAPIRouter):
    def __init__(self, *args, **kwargs):
        if "prefix" not in kwargs:
            kwargs["prefix"] = ""
        kwargs["prefix"] = f'/v1{kwargs["prefix"]}'
        super().__init__(*args, **kwargs)

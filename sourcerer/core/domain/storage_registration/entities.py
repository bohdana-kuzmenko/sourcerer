from typing import Optional

from sourcerer.core.domain.entities import BaseEntity


class StorageRegistration(BaseEntity):
    id: Optional[int]
    name: str

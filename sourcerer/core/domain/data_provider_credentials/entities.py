from typing import Optional

from sourcerer.core.domain.entities import BaseEntity


class DataProviderCredentials(BaseEntity):
    id: Optional[int]
    provider: str
    credentials: str
    active: bool
    created_at: str
    updated_at: str
    owner_id: int


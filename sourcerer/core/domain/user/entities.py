from typing import Optional

from sourcerer.core.domain.entities import BaseEntity


class User(BaseEntity):
    id: Optional[int]
    email: str
    password: str
    first_name: str
    last_name: str

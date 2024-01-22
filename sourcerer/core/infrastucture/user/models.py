from typing import Optional

from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from sqlalchemy import Column, Integer, String

from sourcerer.core.config.db import Base


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String, nullable=False, server_default="")
    first_name = Column(String(100), nullable=False, server_default="")
    last_name = Column(String(100), nullable=False, server_default="")


PydanticUserBase = sqlalchemy_to_pydantic(User)


class PydanticUser(PydanticUserBase):
    id: Optional[int] = None

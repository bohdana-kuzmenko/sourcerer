import enum
from datetime import datetime
from typing import Optional

from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from sourcerer.core.config.db import Base, encryption_key
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy_utils.types.encrypted.encrypted_type import EncryptedType


class SourceProvidersEnum(str, enum.Enum):
    blobby = "BLOBBY"
    apple_s3 = "APPLE_S3"
    mcqueen = "MCQUEEN"


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String, nullable=False, server_default="")
    first_name = Column(String(100), nullable=False, server_default="")
    last_name = Column(String(100), nullable=False, server_default="")


class SourceCredentials(Base):
    __tablename__ = "source"
    id = Column(Integer, primary_key=True)
    provider = Column(Enum(SourceProvidersEnum), nullable=False)
    credentials = Column(String, nullable=False)  # ToDo should be encrypted
    # credentials = Column( EncryptedType(String, encryption_key), nullable=False)  # ToDo should be encrypted
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey(f"user.id"), nullable=True)


PydanticUserBase = sqlalchemy_to_pydantic(User)
PydanticSourceCredentials = sqlalchemy_to_pydantic(SourceCredentials)


class PydanticUser(PydanticUserBase):
    id: Optional[int]


class ExtendedPydanticSourceCredentials(PydanticSourceCredentials):
    id: Optional[str] = None
    credentials: Optional[dict]

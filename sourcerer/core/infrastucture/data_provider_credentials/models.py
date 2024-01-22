from datetime import datetime
from typing import Optional

from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy_utils.types.encrypted.encrypted_type import EncryptedType

from sourcerer.core.config.db import Base, encryption_key
from sourcerer.core.infrastucture.data_provider.entities import DataProvidersEnum


class Credentials(Base):
    __tablename__ = "credentials"
    id = Column(Integer, primary_key=True)
    provider = Column(Enum(DataProvidersEnum), nullable=False)
    credentials = Column(EncryptedType(String, encryption_key), nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey(f"user.id"), nullable=True)


PydanticDataProviderCredentials = sqlalchemy_to_pydantic(Credentials)


class ExtendedPydanticDataProviderCredentials(PydanticDataProviderCredentials):
    id: Optional[str] = None
    credentials: Optional[dict]

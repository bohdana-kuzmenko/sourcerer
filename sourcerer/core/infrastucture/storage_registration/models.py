from datetime import datetime
from typing import Optional

from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

from sourcerer.core.config.db import Base


class StorageRegistration(Base):
    __tablename__ = "storage_registration"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    credentials_id = Column(Integer, ForeignKey(f"credentials.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


PydanticStorageRegistration = sqlalchemy_to_pydantic(StorageRegistration)


class ExtendedPydanticStorageRegistration(PydanticStorageRegistration):
    id: Optional[str]

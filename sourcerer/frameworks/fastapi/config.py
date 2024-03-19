from fastapi import FastAPI
from sqlalchemy.orm import scoped_session
from fastapi.middleware.cors import CORSMiddleware

from sourcerer.core.config.db import SessionLocal, engine, Base

from sourcerer.core.infrastucture.user.models import *
from sourcerer.core.infrastucture.data_provider_credentials.models import *
from sourcerer.core.infrastucture.storage_registration.models import *


app = FastAPI()
app.db = scoped_session(SessionLocal)
Base.metadata.create_all(bind=engine)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88esdad"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

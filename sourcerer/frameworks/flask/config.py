from flask import Flask, _app_ctx_stack

from sourcerer.core.config.db import (
    SQLALCHEMY_DATABASE_URL,
    db,
    SessionLocal,
    Base,
    engine,
)
from sourcerer.core.infrastructure.controllers.source import SourceController
from sourcerer.core.infrastructure.models import *
from sourcerer.core.infrastructure.services.locals.source import RegisteredSourcesService
from sqlalchemy.orm import scoped_session

app = Flask(__name__)

app.db = scoped_session(SessionLocal)
Base.metadata.create_all(bind=engine)

service = RegisteredSourcesService(app.db)
controller = SourceController(service)

from sourcerer.core.infrastructure.controllers.source import SourceController
from sourcerer.core.infrastructure.controllers.users import UsersController
from sourcerer.core.infrastructure.services.locals.source import RegisteredSourcesService
from sourcerer.core.infrastructure.services.users import UsersService
from sourcerer.frameworks.fastapi.config import app

source_service = RegisteredSourcesService(app.db)
source_controller = SourceController(source_service)

users_service = UsersService(app.db)
users_controller = UsersController(users_service)
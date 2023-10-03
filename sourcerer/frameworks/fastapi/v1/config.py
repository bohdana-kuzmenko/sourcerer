from sourcerer.core.infrastructure.controllers.credentials import CredentialsController
from sourcerer.core.infrastructure.controllers.storages import StoragesController
from sourcerer.core.infrastructure.controllers.users import UsersController
from sourcerer.core.infrastructure.services.credentials import RegisteredCredentialsService
from sourcerer.core.infrastructure.services.users import UsersService
from sourcerer.frameworks.fastapi.config import app

source_service = RegisteredCredentialsService(app.db)
credentials_controller = CredentialsController(source_service)
storages_controller = StoragesController(source_service)

users_service = UsersService(app.db)
users_controller = UsersController(users_service)
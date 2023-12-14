from sourcerer.core.infrastucture.data_provider.controllers import DataProviderController
from sourcerer.core.infrastucture.data_provider_credentials.controllers import DataProviderCredentialsController
from sourcerer.core.infrastucture.data_provider_credentials.services import DataProviderCredentialsService
from sourcerer.core.infrastucture.user.controllers import UsersController
from sourcerer.core.infrastucture.user.services import UsersService
from sourcerer.frameworks.fastapi.config import app

source_service = DataProviderCredentialsService(app.db)
credentials_controller = DataProviderCredentialsController(source_service)
storages_controller = DataProviderController(source_service)

users_service = UsersService(app.db)
users_controller = UsersController(users_service)
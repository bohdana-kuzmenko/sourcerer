import urllib3

from sourcerer.frameworks.fastapi.exceptions_handler import register_exc_handler
from sourcerer.frameworks.fastapi.v1.routers.users import router as users_route
from sourcerer.frameworks.fastapi.v1.routers.storages import router as storages_router
from sourcerer.frameworks.fastapi.v1.routers.registrations import router as registrations_route
from sourcerer.frameworks.fastapi.config import app


urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

register_exc_handler(app)

app.include_router(registrations_route)
app.include_router(storages_router)
app.include_router(users_route)

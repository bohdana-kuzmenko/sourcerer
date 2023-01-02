from sqlalchemy.orm import scoped_session

from sourcerer.core.config.db import Base, engine, SessionLocal
from sourcerer.core.infrastructure.controllers.source import SourceController
from sourcerer.core.infrastructure.controllers.users import UsersController
from sourcerer.core.infrastructure.services.locals.source import RegisteredSourcesService


from sourcerer.core.infrastructure.services.remotes import *
from sourcerer.core.infrastructure.services.users import UsersService

db = scoped_session(SessionLocal)
Base.metadata.create_all(engine)

service = RegisteredSourcesService(db)
controller = SourceController(service)
# print(controller.add({"provider":"BLOBBY", "display_name":"boo", "name":"boo", "credentials_type": "sa"}))


# print(controller.list_registration())
# print(controller.list_sources())
# print(controller.list_source_content(1, bucket='cvat_bohdana_test'))

users_service = UsersService(db)
users_controller = UsersController(users_service)

# users_controller.create(
#     email="test", password="pass", first_name="name", last_name="last"
# )
#

print(users_controller.get_by_email('test'))
print(users_controller.validate_password(users_controller.get_by_email('test'), 'pass'))
from sourcerer.core.domain.user.services import BaseUsersService
from sourcerer.core.infrastucture.user.models import PydanticUser


class UsersController:
    def __init__(self, service: BaseUsersService):
        self.service = service

    def create(self, email, password, first_name, last_name, id=None):
        user = PydanticUser.parse_obj(
            {
                "email": email,
                "password": password,
                "first_name": first_name,
                "last_name": last_name,
            }
        )
        return self.service.create(user)

    def get(self, id):
        return self.service.get(id)

    def get_by_email(self, email):
        return self.service.get_by_email(email)

    def validate_password(self, user: PydanticUser, password: str) -> bool:
        return self.service.verify_user_credentials(user, password)

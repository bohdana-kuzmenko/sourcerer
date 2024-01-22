from sourcerer.core.domain.services import BaseService


class BaseUsersService(BaseService):
    def create(self, user):
        raise NotImplemented

    def update(self):
        raise NotImplemented

    def get(self, id: int):
        raise NotImplemented

    def get_by_email(self, email: str):
        raise NotImplemented

    def verify_user_credentials(self, user, password: str) -> bool:
        raise NotImplemented

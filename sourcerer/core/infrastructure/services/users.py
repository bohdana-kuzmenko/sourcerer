from sourcerer.core.domain.services import BaseService
from sourcerer.core.infrastructure.models import PydanticUser, User, PydanticUserBase
from sourcerer.core.infrastructure.services.crypto_hash import CryptoHasher


class BaseUsersException(BaseException):
    pass


class UserNotFoundException(BaseUsersException):
    pass


class BaseUsersService(BaseService):
    def create(self, user: PydanticUser)-> PydanticUser:
        raise NotImplemented

    def update(self):
        raise NotImplemented

    def get(self, id: int) -> PydanticUser:
        raise NotImplemented

    def get_by_email(self, email: str) -> PydanticUser:
        raise NotImplemented

    def verify_user_credentials(self, user: PydanticUser, password: str) -> bool:
        raise NotImplemented


class UsersService(BaseUsersService):
    def __init__(self, db):
        self.db = db

    def create(self, user: PydanticUser):
        user = user.dict()
        user['password'] = CryptoHasher.get_hash(user['password'])
        user = User(**user)
        self.db.add(user)
        self.db.commit()
        return PydanticUser.from_orm(user)

    def update(self):
        pass

    def get(self, id: int) -> PydanticUserBase:
        user = self.db.query(User).filter_by(id=id).first()
        if not user:
            raise UserNotFoundException(id)
        return PydanticUserBase.from_orm(user)

    def get_by_email(self, email: str) -> PydanticUser:
        user = self.db.query(User).filter_by(email=email).first()
        if not user:
            return
        return PydanticUser.from_orm(user)

    def verify_user_credentials(self, user: PydanticUser, password: str) -> bool:
        try:
            return CryptoHasher.verify_hash(password, user.password)
        except Exception:
            return False

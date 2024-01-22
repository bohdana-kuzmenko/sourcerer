from sourcerer.core.domain.user.services import BaseUsersService
from sourcerer.core.infrastucture.user.exceptions import UserNotFoundException
from sourcerer.core.infrastucture.user.models import PydanticUser, PydanticUserBase, User
from sourcerer.core.infrastucture.user.utils import CryptoHasher


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

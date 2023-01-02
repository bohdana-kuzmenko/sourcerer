from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class CryptoHasher:
    @staticmethod
    def verify_hash(plain_value, hashed_value):
        return pwd_context.verify(plain_value, hashed_value)

    @staticmethod
    def get_hash(value: str):
        return pwd_context.hash(value)
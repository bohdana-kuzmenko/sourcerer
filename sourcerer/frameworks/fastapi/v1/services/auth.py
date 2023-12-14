from datetime import timedelta, datetime
from typing import Union, Optional

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBasicCredentials, HTTPBasic, OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from starlette import status

from sourcerer.core.infrastucture.user.models import PydanticUserBase
from sourcerer.frameworks.fastapi.v1.config import users_controller
from sourcerer.frameworks.fastapi.config import SECRET_KEY, ALGORITHM


class TokenData(BaseModel):
    email: Union[str, None] = None


http_basic_security = HTTPBasic(auto_error=False)
http_bearer_security = OAuth2PasswordBearer(tokenUrl="api/v1/auth/token", auto_error=False)


def get_current_basic_auth_user(credentials: Optional[HTTPBasicCredentials] = Depends(http_basic_security)):
    if not credentials:
        return
    user = users_controller.get_by_email(credentials.username)
    if not users_controller.validate_password(user, credentials.password):
        return
    return user


def get_current_token_auth_user(token: Optional[str] = Depends(http_bearer_security)):
    if not token:
        return
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return
        token_data = TokenData(email=username)
    except JWTError:
        return
    return users_controller.get_by_email(email=token_data.email)


def get_current_user(
        basic_user: Optional[PydanticUserBase] = Depends(get_current_basic_auth_user),
        token_user: Optional[PydanticUserBase] = Depends(get_current_token_auth_user)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    if basic_user:
        return basic_user
    if token_user:
        return token_user
    else:
        raise credentials_exception


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

from datetime import timedelta
from fastapi import Depends

from sourcerer.core.infrastucture.user.models import PydanticUser
from sourcerer.frameworks.fastapi.v1.routers.base import V1APIRouter
from sourcerer.frameworks.fastapi.v1.config import users_controller
from sourcerer.frameworks.fastapi.v1.schemas.auth import Credentials
from sourcerer.frameworks.fastapi.v1.services.auth import (
    get_current_basic_auth_user,
    create_access_token,
    get_current_user
)
from sourcerer.frameworks.fastapi.config import ACCESS_TOKEN_EXPIRE_MINUTES


class UsersAPIRouter(V1APIRouter):
    tags = ['users']


router = UsersAPIRouter(prefix='/auth')


@router.post("/signin")
def signin(user: PydanticUser):
    user = users_controller.create(**user.dict())
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {
        "user": f'{user.first_name} {user.last_name}',
        "email": user.email,
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/login")
def login(credentials: Credentials):
    user = users_controller.get_by_email(credentials.username)
    if not user:
        raise Exception(f"User with email {credentials.username} does not exist")  # ToDo: not authorized exception
    if not users_controller.validate_password(user, credentials.password):
        raise Exception("not author")  # ToDo: not authorized exception
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {
        "user": f'{user.first_name} {user.last_name}',
        "email": user.email,
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/token")
def get_auth_token(
        user: PydanticUser = Depends(get_current_basic_auth_user)
):
    """
    Generate JWT token for token-based  authentication.
    Token expires in 30 minutes
    """
    if not user:
        return "not auth"
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_user(
        user: PydanticUser = Depends(get_current_user)
):
    """
    Generate JWT token for token-based  authentication.
    Token expires in 30 minutes
    """
    if not user:
        return "not auth"
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {
        "user": f'{user.first_name} {user.last_name}',
        "email": user.email,
        "access_token": access_token,
        "token_type": "bearer"
    }

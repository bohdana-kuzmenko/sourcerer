from sourcerer.core.domain.exceptions import SourcerBaseException, BaseUsersException


class SourceAccessError(SourcerBaseException):
    pass


class AWSConfigurationError(SourcerBaseException):
    pass


class BLOBBYConfigurationError(AWSConfigurationError):
    pass


class UserNotFoundException(BaseUsersException):
    pass

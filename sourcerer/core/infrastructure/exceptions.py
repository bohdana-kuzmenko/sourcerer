from sourcerer.core.domain.exceptions import SourcerBaseException


class SourceAccessError(SourcerBaseException):
    pass


class AWSConfigurationError(SourcerBaseException):
    pass


class BLOBBYConfigurationError(AWSConfigurationError):
    pass

from sourcerer.core.domain.data_provider.exceptions import DataProviderBaseException


class DataProviderAccessError(DataProviderBaseException):
    pass


class AWSConfigurationError(DataProviderBaseException):
    pass


class BLOBBYConfigurationError(AWSConfigurationError):
    pass


class SourceNotFoundException(DataProviderBaseException):
    pass

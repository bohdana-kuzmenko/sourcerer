from sourcerer.core.domain.exceptions import SourcerBaseException

CRITICAL = 50
ERROR = 40
WARNING = 30
WARN = WARNING
INFO = 20
DEBUG = 10
NOTSET = 0


class LoggerException(SourcerBaseException):
    """Base class for Logger execution exceptions."""

    pass


class AbstractLogger:
    """Base class for Loggers."""

    def debug(self, msg):
        """Delegate an debug call to the underlying logger.
        :type msg: str
        :param msg: Logging message.
        """

        raise NotImplementedError

    def info(self, msg):
        """Delegate an info call to the underlying logger.
        :type msg: str
        :param msg: Logging message.
        """

        raise NotImplementedError

    def warn(self, msg):
        """Delegate a warning call to the underlying logger.
        :type msg: str
        :param msg: Logging message.
        """

        raise NotImplementedError

    def err(self, msg):
        """Delegate an error call to the underlying logger.
        :type msg: str
        :param msg: Logging message.
        """

        raise NotImplementedError

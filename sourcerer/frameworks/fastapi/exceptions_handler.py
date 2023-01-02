from starlette.responses import JSONResponse

from sourcerer.core.infrastructure.exceptions import SourceAccessError, BLOBBYConfigurationError
from fastapi import Request, status


def register_exc_handler(app):
    @app.exception_handler(SourceAccessError)
    def handle_validation_exc(request: Request, exc: SourceAccessError):
        response = JSONResponse(status_code=status.HTTP_424_FAILED_DEPENDENCY, content={"error": str(exc)})
        return response

    @app.exception_handler(BLOBBYConfigurationError)
    def handle_validation_exc(request: Request, exc: BLOBBYConfigurationError):
        response = JSONResponse(status_code=status.HTTP_424_FAILED_DEPENDENCY, content={"error": str(exc)})
        return response
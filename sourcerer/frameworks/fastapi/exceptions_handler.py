from starlette.responses import JSONResponse

from sourcerer.core.infrastructure.exceptions import SourceAccessError, BLOBBYConfigurationError
from fastapi import Request, status


def register_exc_handler(app):
    @app.exception_handler(SourceAccessError)
    def handle_validation_exc(request: Request, exc: SourceAccessError):
        return JSONResponse(status_code=status.HTTP_424_FAILED_DEPENDENCY, content={"error": str(exc)})

    @app.exception_handler(BLOBBYConfigurationError)
    def handle_validation_exc(request: Request, exc: BLOBBYConfigurationError):
        return JSONResponse(status_code=status.HTTP_424_FAILED_DEPENDENCY, content={"error": str(exc)})

    @app.exception_handler(Exception)
    def handle_validation_exc(request: Request, exc):
        base_error_message = f"Failed to execute: {request.method}: {request.url}"
        # Change here to LOGGER
        return JSONResponse(status_code=400, content={"message": f"{base_error_message}. Detail: {exc}"})

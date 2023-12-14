from starlette.responses import JSONResponse

from fastapi import Request, status

from sourcerer.core.infrastucture.data_provider.exceptions import DataProviderAccessError, BLOBBYConfigurationError


def register_exc_handler(app):
    @app.exception_handler(DataProviderAccessError)
    def handle_validation_exc(request: Request, exc: DataProviderAccessError):
        return JSONResponse(status_code=status.HTTP_424_FAILED_DEPENDENCY, content={"error": str(exc)})

    @app.exception_handler(BLOBBYConfigurationError)
    def handle_validation_exc(request: Request, exc: BLOBBYConfigurationError):
        return JSONResponse(status_code=status.HTTP_424_FAILED_DEPENDENCY, content={"error": str(exc)})

    @app.exception_handler(Exception)
    def handle_validation_exc(request: Request, exc):
        base_error_message = f"Failed to execute: {request.method}: {request.url}"
        return JSONResponse(status_code=400, content={"message": f"{base_error_message}. Detail: {exc}"})

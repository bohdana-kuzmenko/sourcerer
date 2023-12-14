import traceback


class StorageConfigurationErrorHandler:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_val:
            print(exc_type)
            print(exc_val)
            print(traceback.format_exception(exc_type, exc_val, exc_tb))
        return True
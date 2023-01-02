from flask_restx import Api
from sourcerer.core.infrastructure.services.remotes import *
from sourcerer.frameworks.flask.config import app

from sourcerer.frameworks.flask.controllers.resources import Resources
from sourcerer.frameworks.flask.controllers.storages import Storages


import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

api = Api(app)

api.add_resource(Resources, "/resources")
api.add_resource(Storages, "/storages")

if __name__ == "__main__":
    app.run(debug=True)

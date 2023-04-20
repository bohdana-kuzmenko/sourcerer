from flask import jsonify
from flask_restx import Resource, Namespace

from sourcerer.frameworks.flask.config import controller

# resources = Namespace('resources', 'Job related endpoints')


# @resources.route('')
class Resources(Resource):
    def get(self):
        return jsonify(controller.list_registration())

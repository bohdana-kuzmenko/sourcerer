from flask import jsonify
from flask_restx import Resource, Namespace

from sourcerer.frameworks.flask.config import controller

storages = Namespace("storages")


class Storages(Resource):
    def get(self):
        return jsonify(controller.list_sources())

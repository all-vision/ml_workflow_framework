import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory, jsonify, request
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import pandas as pd
import ast
import uuid
import yaml
import db
from azure.storage.blob import BlobServiceClient
from azure.storage.blob import ContainerClient
from sklearn.cluster import KMeans
from sklearn import metrics
from models import km
def load_config():
    directory = os.path.dirname(os.path.abspath(__file__))
    with open(directory + "/config.yaml", "r") as yamlfile:
        return yaml.load(yamlfile, Loader=yaml.FullLoader)

def download_helper(file_name):

    config = load_config()
    connection_string = config["azure_storage_connection_string"]
    container_name = config["user_datasets_container_name"]
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(container_name)

    try:
        # upload file using Azure blob client
        blob_client = container_client.get_blob_client(file_name)
        download_file_path = os.path.join("./data", (file_name))
        with open(download_file_path, "wb") as download_file:
            download_file.write(blob_client.download_blob().readall())
        return True

    except Exception as e:
        return False

@app.route("/")
def up():
    return "Up"


@app.route("/data", methods=["GET", "POST"])
def getData():
    requestData = request.get_json()
    if not requestData:
        return jsonify(status=412)

    file_name = secure_filename(requestData["filename"])
    download_helper(file_name)
    a = pds.read_csv("./data/" + file_name)
    b = a.to_json(orient="records")
    if os.path.exists("./data" + file_name):
        os.remove("./data" + file_name)
    return b

@app.route("/embed", methods=["POST"])
def generate_embeddings():
    requestData = request.get_json()
    if not requestData:
        return jsonify(status=412)
    file_name = secure_filename(requestData["filename"])
    thread = threading.Thread(target=embedding, args=(file_name,))
    thread.start()

    return jsonify("Success")

@app.route("/eventmapping", methods= ["POST"])
def generate_event_mapping():
    requestData = request.get_json()
    if not requestData:
        return jsonify(status=412)
    event = requestData["event"]
    events



if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run('0.0.0.0',debug=True, port=80)

CORS(app, expose_headers='Authorization')
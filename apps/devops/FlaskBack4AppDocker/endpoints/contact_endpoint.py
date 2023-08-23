import time
from configs import CONFIGS
import requests;
import math
from flask import Blueprint,request
import json
from urllib.parse import urlparse
from utils.my_util import APIMsgFormat
from utils.print_if_dev import print_if_dev


contact_endpoint =Blueprint("contact", __name__, url_prefix="/contact")

@contact_endpoint.route('/submit-new-client',methods=['POST'])
def get_contacts():
  req_body = request.json.get("data")
  req_body["msg"] = req_body["desc"]
  CONFIGS.email_manager.send_email(req_body)

  resp_body= APIMsgFormat(
    code= CONFIGS.endpointMsgCodes["success"]
  )
  return resp_body.return_flask_response(),200




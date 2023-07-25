import time
from configs import CONFIGS
import requests;
import math
from flask import Blueprint,request
import json
from urllib.parse import urlparse

from utils.my_util import APIMsgFormat
from utils.print_if_dev import print_if_dev


scratchpad_endpoint =Blueprint("scratchpad", __name__, url_prefix="/scratchpad")

@scratchpad_endpoint.route('/list-products',methods=['POST'])
def scratchpad_get_products():
  req_body = request.json.get("data")
  result = CONFIGS.square_manager.list_products()

  res = APIMsgFormat(data=result,code=CONFIGS.endpointMsgCodes["success"])
  return res.return_flask_response(),200

@scratchpad_endpoint.route('/get-storage-buckets',methods=['POST'])
def scratchpad_get_product_images():
  req_body = request.json.get("data")
  result = CONFIGS.firebase_manager.get_storage_data()
  res = APIMsgFormat(data=result,code=CONFIGS.endpointMsgCodes["success"])
  return res.return_flask_response(),200

@scratchpad_endpoint.route('/sign_up',methods=['POST'])
def scratchpad_sign_up():
  result = CONFIGS.firebase_manager.sign_in("")
  res = APIMsgFormat(data=result,code=CONFIGS.endpointMsgCodes["success"])
  return res.return_flask_response(),200

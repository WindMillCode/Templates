import time
from configs import CONFIGS
import requests;
import math
from flask import Blueprint,request
import json
from urllib.parse import urlparse

from utils.my_util import APIMsgFormat
from utils.print_if_dev import print_if_dev
from handlers  import accounts_handler


scratchpad_endpoint =Blueprint("scratchpad", __name__, url_prefix="/scratchpad")


@scratchpad_endpoint.route('/users/list',methods=['POST'])
def scratchpad_endpoint_list_users():
  data = request.json.get('data',{})
  page_data = CONFIGS.square_manager.list_customers(data)

  res = APIMsgFormat(data=page_data,msg="A-OK",code=CONFIGS.endpointMsgCodes["success"])
  return res.return_flask_response(),200


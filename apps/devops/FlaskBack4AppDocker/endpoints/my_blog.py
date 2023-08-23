import time
from configs import CONFIGS
import requests;
import math
from flask import Blueprint,request
import json
from urllib.parse import urlparse
from utils.print_if_dev import print_if_dev


myblog =Blueprint("blog", __name__, url_prefix="/blog")

@myblog.route('/post',methods=['POST'])
def get_blogs():
  req_body = request.json.get("data")
  resp_body = CONFIGS.mysql_manager.get_rows_from_table(
    req_body,
    CONFIGS.mysql_manager.entity_enums.BLOG.value +"_Table"
  )

  return {
    "data":resp_body,
    "code": CONFIGS.endpointMsgCodes["success"]
  },200




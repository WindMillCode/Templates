import time
from configs import CONFIGS
import requests;
import math
from flask import Blueprint,request
import json
from urllib.parse import urlparse
from utils.print_if_dev import print_if_dev


myevents =Blueprint("events", __name__, url_prefix="/events")

@myevents.route('/online',methods=['POST'])
def get_online_events():
  req_body = request.json.get("data")
  req_body["filter"]= [{
    "key":"location_type",
    "value":"%Online%"
  }]
  req_body["sort"] = []
  resp_body = CONFIGS.mysql_manager.get_rows_from_table(
    req_body,
    "Events_With_Location_Type_Value_View"
  )

  return {
    "data":resp_body,
    "code": CONFIGS.endpointMsgCodes["success"]
  },200


@myevents.route('/in-person',methods=['POST'])
def get_inperson_events():
  req_body = request.json.get("data")
  req_body["filter"]= [{
    "key":"location_type",
    "value":"%In-Person%"
  }]
  req_body["sort"] = []
  resp_body = CONFIGS.mysql_manager.get_rows_from_table(
    req_body,
    "Events_With_Location_Type_Value_View"
  )

  return {
    "data":resp_body,
    "code": CONFIGS.endpointMsgCodes["success"]
  },200





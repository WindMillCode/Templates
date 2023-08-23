import time
from configs import CONFIGS
import requests;
import math
from enum import Enum
from flask import Blueprint,request
import json
from urllib.parse import urlparse
from flask.helpers import send_file
from managers.firebase_manager.check_for_authentication import check_for_authentication
from managers.firebase_manager.firebase_manager import FirebaseManager
from utils.api_exceptions import APIAuthorizationError, APIServerError
from utils.iterable_utils import list_get


from utils.my_util import APIMsgFormat
from utils.print_if_dev import print_if_dev
from utils.wml_libs.pagination import WMLAPIPaginationResponseModel
from handlers  import accounts_handler


accounts_endpoint =Blueprint("accounts", __name__, url_prefix="/accounts")

@accounts_endpoint.route('get_square_customer_id_via_firebase_access_token',methods=['POST'])
@check_for_authentication()
def accounts_endpoint_get_square_customer_id_via_firebase_access_token(firebase_uid,square_uid):
  data = request.json.get('data',{})


  res = APIMsgFormat(data={"square_customer_id":square_uid},msg="A-OK",code=CONFIGS.endpointMsgCodes["success"])
  return res.return_flask_response()

@accounts_endpoint.route('/users/create',methods=['POST'])
@check_for_authentication(square_id_required=False)
def create_user_accounts(firebase_uid):
  data = request.json["data"]
  if firebase_uid != data["uid"]:
    # The user is authentication but this is the incoorect firebase id
    res = APIAuthorizationError()
    return res.return_flask_response()
  try:
    CONFIGS.firebase_manager.set_env_for_user(data["uid"])
    sqaure_customer =CONFIGS.square_manager.create_customer(data["uid"],data["email"])
  except BaseException as e:

    return APIServerError("An error occured while creating the account {}".format(e)).return_flask_response()
  data = {
    "sqaure_customer_id":sqaure_customer["customer"]["id"]
  }
  res = APIMsgFormat(data=data, msg="A-OK",code=CONFIGS.endpointMsgCodes["success"])
  return res.return_flask_response(),200


@accounts_endpoint.route('/users/update',methods=['PUT'])
@check_for_authentication()
def accounts_endpoint_update_users(firebase_uid,square_uid):
  data = request.json.get('data',{})
  accounts_handler.update_users(data["customers_to_update"],[square_uid])
  res = APIMsgFormat(msg="A-OK",code=CONFIGS.endpointMsgCodes["success"])
  return res.return_flask_response(),200

@accounts_endpoint.route('/users/delete',methods=['POST','DELETE'])
@check_for_authentication()
def accounts_endpoint_delete_users(firebase_uid,square_uid):
  data = request.json.get('data',{})

  id_list =[{
    "firebase_uid":firebase_uid,
    "square_uid":square_uid
  }]
  accounts_handler.delete_users(data["customers_to_delete"],id_list)
  res = APIMsgFormat(msg="A-OK",code=CONFIGS.endpointMsgCodes["success"])
  return res.return_flask_response(),200


@accounts_endpoint.route('/users/export',methods=['POST'])
@check_for_authentication()
def accounts_endpoint_export_users(firebase_uid,square_uid):
  data = request.json.get('data',{})

  id_list =[{
    "firebase_uid":firebase_uid,
    "square_uid":square_uid
  }]
  export_data =accounts_handler.export_users(data["target_users"],id_list)
  res = APIMsgFormat(msg="A-OK",data={'content':export_data},code=CONFIGS.endpointMsgCodes["success"])
  flask_response = res.return_flask_response()
  flask_response.headers.set('Content-Disposition','attachment; filename={}'.format("export_data.pdf"))
  return  flask_response

class AccountsEndpointUsersListTypeEnum(Enum):
    GETPROFILE = 1

@accounts_endpoint.route('/users/list',methods=['POST'])
@check_for_authentication()
def accounts_endpoint_list_users(firebase_uid,square_uid):

  data = request.json.get('data',{})

  api_reference_id =CONFIGS.square_manager.create_reference_id(firebase_uid)
  reference_id =list_get(
    list(filter(lambda x:x["key"] == "reference_id" and x["value"] == api_reference_id,  data["filter"])),
    0,None
  ).get("value",None)
  if reference_id != api_reference_id:
    # client had the access token but the wrong refernce_id
    res = APIAuthorizationError()
    return res.return_flask_response()

  page_data = CONFIGS.square_manager.list_customers(data)
  res = APIMsgFormat(data=page_data,msg="A-OK",code=CONFIGS.endpointMsgCodes["success"])
  return res.return_flask_response(),200

@accounts_endpoint.route('/cards/create',methods=['PUT'])
@check_for_authentication()
def accounts_endpoint_add_card_to_customer(firebase_uid,square_uid):
  data = request.json.get('data',{})
  CONFIGS.square_manager.store_customer_card_on_file(square_uid,data["payment_method_token"])
  res = APIMsgFormat(msg="A-OK",code=CONFIGS.endpointMsgCodes["success"])
  return res.return_flask_response(),200

@accounts_endpoint.route('/cards/list',methods=['POST'])
@check_for_authentication()
def accounts_endpoint_list_cards(firebase_uid,square_uid):
  data = request.json.get('data',{})
  res_page_object =CONFIGS.square_manager.list_cards_via_customer_id([square_uid])
  res = APIMsgFormat(data=res_page_object,msg="A-OK",code=CONFIGS.endpointMsgCodes["success"])
  return res.return_flask_response(),200


@accounts_endpoint.route('/cards/delete',methods=['DELETE'])
@check_for_authentication()
def accounts_endpoint_delete_cards(firebase_uid,square_uid):
  data = request.json.get('data',{})
  CONFIGS.square_manager.delete_cards(
    data["ids"],
    square_uid
  )

  res = APIMsgFormat(msg="A-OK",code=CONFIGS.endpointMsgCodes["success"])
  return res.return_flask_response(),200

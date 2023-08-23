import base64
import datetime
import json
from configs import CONFIGS
from firebase_admin.auth import ExportedUserRecord
from utils.api_exceptions import APIServerError
from utils.iterable_utils import list_get
from utils.print_if_dev import print_if_dev
from utils.wml_libs.pagination import WMLAPIPaginationRequestModel
import ndjson


def update_users(req_body,square_ids):
  authorized_batch = list(filter(lambda x:x["id"] in square_ids,req_body))
  CONFIGS.square_manager.update_customers(authorized_batch)


def delete_users(req_body,id_list):
  authorized_batch = get_authorized_batch(id_list,req_body)
  firebase_user_ids = [x["firebase_user_id"] for x in authorized_batch]
  square_customer_ids = [x["square_customer_id"] for x in authorized_batch]
  CONFIGS.firebase_manager.delete_users(firebase_user_ids)
  CONFIGS.square_manager.delete_customers(square_customer_ids)


def get_authorized_batch(id_list,req_body):
  return list(filter(lambda x:filter_predicate_for_managing_users(x,id_list),req_body));

def filter_predicate_for_managing_users(item,id_list):
  firebase_id_is_correct = item["firebase_user_id"] in [x["firebase_uid"] for x in id_list]
  sqaure_id_is_correct = item["square_customer_id"] in [x["square_uid"] for x in id_list]
  return firebase_id_is_correct and sqaure_id_is_correct



def export_users(req_body,id_list):
  export_data= {
    'date_requested':datetime.datetime.now().strftime("%B %d, %Y %H:%M:%S"),
    'users':[]
  }
  authorized_batch = get_authorized_batch(id_list,req_body)
  square_acct_page_res_model, firebase_accts, entities = query_for_user_data(authorized_batch)
  create_export_data_obj(export_data, authorized_batch, square_acct_page_res_model, firebase_accts, entities)
  export_binary_data = CONFIGS.reportlab_manager.create_pdf_from_json("Export Data",json.dumps(export_data,indent=2))
  return base64.b64encode(export_binary_data).decode('utf-8')

def query_for_user_data(authorized_batch):
    square_acct_filters = []
    for item in authorized_batch:
      square_acct_filters.append(
      {"key": "reference_id", "value":CONFIGS.square_manager.create_reference_id(item["firebase_user_id"])}
    )
      firebase_ids_to_get_acct_info = [item["firebase_user_id"] for item in authorized_batch]

    square_acct_page_req_model = WMLAPIPaginationRequestModel(filter=square_acct_filters)
    square_acct_page_res_model=CONFIGS.square_manager.list_customers(square_acct_page_req_model)
    firebase_accts  =CONFIGS.firebase_manager.list_users(firebase_ids_to_get_acct_info)
    entities = [square_acct_page_res_model.data,firebase_accts]
    return square_acct_page_res_model,firebase_accts,entities

def create_export_user_obj(square_acct, firebase_acct):
    export_user ={
      'address':{
        'street_address' : square_acct['address']['address_line_1'],
        'apt' : square_acct['address']['address_line_2'],
        'state' : square_acct['address']['administrative_district_level_1'],
        'country' : square_acct['address']['country'],
        'city' : square_acct['address']['locality'],
        'zipcode' : square_acct['address']['postal_code']
      },
      'username':firebase_acct.display_name,
      'email':firebase_acct.email,
      'phone_number':firebase_acct.phone_number,
      'social_accts':[
        {
          "social_media_platform":idp.provider_id
        }
        for idp in firebase_acct.provider_data
      ]
    }

    return export_user

def create_export_data_obj(export_data, authorized_batch, square_acct_page_res_model, firebase_accts, entities):
    if not all(len(entity) == len(authorized_batch) for entity in entities):
      raise APIServerError("A filter may not be working properly")
    for item in authorized_batch:
      square_acct =   list_get(
      list(filter(lambda x:x['id'] == item["square_customer_id"], square_acct_page_res_model.data )),
      0,{}
      )
      firebase_acct = list_get(
      list(filter(lambda x:x.uid == item["firebase_user_id"], firebase_accts )),
      0,{}
      )
      export_user = create_export_user_obj(square_acct, firebase_acct)
      export_data['users'].append(export_user)



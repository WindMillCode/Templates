
import json
import math
import os
import random
import time
import uuid
from utils.print_if_dev import print_if_dev
from utils.api_exceptions import APIClientError, APIServerError
from utils.singleton_exception import SingletonException
from utils.local_deps import  local_deps
local_deps()
from square.client import Client

class SquareManager():
  init= False
  client = None
  online_location_id =None
  def __init__(self,access_token):
    if(self.init):
      raise SingletonException
    else:
      self.init = True
      self.client = Client(
        access_token=access_token,
        environment='sandbox',
        max_retries=2,
        timeout=10
      )
      self.online_location_id = self._get_location_id()



  def list_products(self):
    items = self.client.catalog.list_catalog(
      types = "ITEM"
    )
    options = self.client.catalog.list_catalog(
      types = "ITEM_OPTION"
    )
    if items.is_success() and options.is_success() :
      return self._combine_items_and_options(items.body,options.body)
    else:
      raise APIServerError({
        items:items.errors,
        options:items.errors
      })

  def _combine_items_and_options(self,items,options):
    extracted_options = []
    extracted_values = []
    self._create_option_mapping(options, extracted_options, extracted_values)
    self._assign_option_data_to_items(items, extracted_options, extracted_values)
    return items

  def _create_option_mapping(self, options, extracted_options, extracted_values):
      for option in options["objects"]:
        extracted_options.append({
        "id":option["id"],
        "name":option["item_option_data"]["name"]
      })
        for x in option["item_option_data"]["values"]:
          extracted_values.append({
          "id":x["id"],
          "name":x["item_option_value_data"]["name"]
        })

  def _assign_option_data_to_items(self, items, extracted_options, extracted_values):
    for product in items["objects"]:
      for variation in product["item_data"]["variations"]:
        for option in variation["item_variation_data"]["item_option_values"]:
          option["item_option"] = list(
            filter(
              lambda x:option["item_option_id"] == x["id"],extracted_options
            )
          )[0]
          option["item_option_value"] = list(
            filter(
              lambda x:option["item_option_value_id"] == x["id"],extracted_values
            )
          )[0]
          del option["item_option_id"]
          del option["item_option_value_id"]

  def get_values_based_on_currency(self,value,currency="USD"):

    currency_info= {
      "USD":{
        "display":"${}".format("{:.2f}".format(round(value / 100, 2))),
        "business":"{:.2f}".format(round(value / 100, 2)),
        "currency":"$"
      }
    }[currency]
    return currency_info

  def transform_currency_to_square_values(self,value,currency="USD"):
    currency_info= {
      "USD":lambda x:math.ceil(x*100)
    }[currency]
    return currency_info(value)


  def create_payment_link(self,cart_items,CONFIGS):
    my_checkout = self.client.checkout.create_payment_link(
      body = {
        "order": {
          "location_id": self.online_location_id,
          "line_items": cart_items
        }
      }
    )
    if my_checkout.is_success():
      my_updated_checkout = self.client.checkout.update_payment_link(
        id = my_checkout.body["payment_link"]["id"],
        body = {
          "payment_link": {
            "version":1,
            "checkout_options": {
              "redirect_url": "{}{}{}".format(
                CONFIGS.app["frontend_angular_app_url"],
                "/store/order-confirmed?orderId=",
                my_checkout.body["payment_link"]["order_id"]
              )
            }
          }
        }
      )
      if my_updated_checkout.is_success():
        return my_checkout.body["payment_link"]["long_url"]
      elif my_updated_checkout.is_error():
        raise APIServerError(my_updated_checkout.errors)
    elif my_checkout.is_error():
      raise APIServerError(my_checkout.errors)


  def update_catalog_variation_item(self,object_id,price=0.00,reset=False):

    variations = self.get_product_by_id(object_id)["object"]["item_data"]["variations"]
    square_variation_data = []

    for x in variations:

      item_variation_data = x["item_variation_data"]
      if reset == True:
        item_variation_data["location_overrides"] =[]
      else:
        item_variation_data["location_overrides"] =[
          {
            "location_id":self.online_location_id,
            "price_money":{
              "amount":self.transform_currency_to_square_values(price),
              "currency": item_variation_data["price_money"]["currency"]
            }
          }
        ]


      variation_body ={
        "type": "ITEM_VARIATION",
        "id": x["id"],
        "version": x["version"],
        "is_deleted": False,
        "present_at_all_locations": True,
        "item_variation_data":item_variation_data
      }
      square_variation_data.append(variation_body)

    update_value = str(uuid.uuid4())
    result = self.client.catalog.batch_upsert_catalog_objects(
      body = {
        "idempotency_key":update_value,
        "batches":[
          {
            "objects":square_variation_data
          }
        ],
      }
    )


    if result.is_error():
      APIServerError(result.errors)



  def _get_location_id(self):
    result = self.client.locations.list_locations()
    if result.is_success():
      my_id = result.body["locations"][0]["id"]
      return my_id
    elif result.is_error():
      raise APIServerError(result.errors)


  def get_product_by_id(self,object_id):
    result = self.client.catalog.retrieve_catalog_object(
      object_id
    )
    if result.is_success():
      return result.body
    elif result.is_error():
      return result.errors





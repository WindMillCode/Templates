import json
import os
import random
import requests
from utils.env_vars import ENV_VARS
from utils.print_if_dev import print_if_dev
from utils.singleton_exception import SingletonException
from utils.local_deps import  local_deps
local_deps()

class EmailManager():
  init= False
  def __init__(self,api_key):
    if(self.init):
      raise SingletonException
    else:
      self.init = True
      self.api_key = api_key


  def send_email(self,from_info,to_email="shieldmousetower734@gmail.com"):
    my_data = json.dumps({
            'to':to_email,
            'subject':"New Client Inquiry",
            'html':"""
            <p>Name: {}</p>
            <p>Email: {}</p>
            <p>Phone: {}</p>
            <p>MSG: {}</p>
            """.format(
              from_info.get('name'),
              from_info.get('email'),
              from_info.get('phone') if from_info.get('phone') else "N/A",
              from_info.get('msg')
            ),
            'company':from_info.get('company'),
            'sendername':"WindMillCodeSite Email Manager"
        })


    resp =requests.post(
        "https://windmillcodesite-8e5b.restdb.io/mail",
        data=my_data,
        headers={
            "Content-Type": "application/json",
            "x-apikey":self.api_key,
            "Cache-Control": "no-cache"
        }
    )

    print_if_dev(resp.status_code)



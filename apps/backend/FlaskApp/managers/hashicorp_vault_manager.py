import json
import os
import random
import time
from utils.api_exceptions import APIServerError
from utils.env_vars import ENV_VARS
from utils.singleton_exception import SingletonException
from utils.local_deps import  local_deps
from utils.print_if_dev import print_if_dev
local_deps()
import hvac

class HashiCorpVaultManager():
  init= False
  client = None
  def __init__(self,url,token):
    if(self.init):
      raise SingletonException
    else:
      self.init = True
      self.client = hvac.Client(
        url=url,
        token=token
      )
      if not self.client.is_authenticated():
        raise APIServerError("client is not authenticated")
      self.set_secrets()
  def set_secrets(self):
    read_response = self.client.secrets.kv.read_secret_version(path='hackathon-square-6-5-23')
    ENV_VARS.update(read_response['data']['data'])








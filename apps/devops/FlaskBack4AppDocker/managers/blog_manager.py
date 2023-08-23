
import json
import os
import random
from utils.print_if_dev import print_if_dev
from utils.api_exceptions import APIClientError
from utils.singleton_exception import SingletonException
from utils.local_deps import  local_deps
local_deps()
from newsapi import NewsApiClient

class BlogManager():
  init= False
  client = None
  def __init__(self,api_key):
    if(self.init):
      raise SingletonException
    else:
      self.init = True
      self.client = NewsApiClient(api_key)

  def grab_articles(self,mysql_manager):
    is_today_info = mysql_manager.retrieve_entity_retrieval_date(
      mysql_manager.entity_enums.BLOG
    )
    if is_today_info.get("is_today") != True:
      mysql_manager.update_entity_retrieval_date(
        mysql_manager.entity_enums.BLOG
      )

      everything = self.client.get_everything(
          q='coding',
          page_size=100,
          language='en'
      )
      content = [
        {
          "title":x["title"],
          "description":x["description"],
          "urlToImage":x["urlToImage"],
          "url":x["url"]
        } for x in everything['articles']
      ]

      mysql_manager.clear_entity_table(
        mysql_manager.entity_enums.BLOG
      )
      random.shuffle(content)
      mysql_manager.insert_into_blog_table(content)










import json
import os
import random
import requests
from utils.env_vars import ENV_VARS
from utils.print_if_dev import print_if_dev
from utils.api_exceptions import APIClientError
from utils.singleton_exception import SingletonException
from utils.local_deps import  local_deps
local_deps()
from eventbrite import Eventbrite
from requests.structures import CaseInsensitiveDict

class EventsManager():
  init= False
  client = None
  def __init__(self,api_key):
    if(self.init):
      raise SingletonException
    else:
      self.init = True
      self.client = Eventbrite(api_key)

  def retrieve_events(self):
    url = "https://www.eventbrite.com/api/v3/destination/search/"
    headers = CaseInsensitiveDict()
    headers["Connection"] = "keep-alive"
    headers["sec-ch-ua"] = '"Chromium";v="92", " Not A;Brand";v="99", "Microsoft Edge";v="92"'
    headers["X-CSRFToken"] = "40f73c7eff3411ebb3d43b267d3d6f31"
    headers["X-Requested-With"] = "XMLHttpRequest"
    headers["sec-ch-ua-mobile"] = "?0"
    headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 Edg/92.0.902.67"
    headers["Content-Type"] = "application/json"
    headers["Accept"] = "*/*"
    headers["Origin"] = "https://www.eventbrite.com"
    headers["Sec-Fetch-Site"] = "same-origin"
    headers["Sec-Fetch-Mode"] = "cors"
    headers["Sec-Fetch-Dest"] = "empty"
    headers["Referer"] = "https://www.eventbrite.com/d/ny--new-york/tech/"
    headers["Accept-Language"] = "en-US,en;q=0.9"
    headers["Cookie"] = 'mgrefby=; G=v%3D2%26i%3D00ed4a44-015e-4aa9-a3cf-fd06463c67a0%26a%3Deb1%26s%3D5f15841c1ac87f2ffd35c4508a8a2272a17e6322; ebEventToTrack=; SS=AE3DLHQS8uTn9-sV6cYFTwFcCs3izLXdcg; eblang=lo%3Den_US%26la%3Den-us; AN=; AS=4c93bcf9-cf97-42de-9557-aafbcc9ec678; mgref=typeins; client_timezone="%22America/New_York%22"; csrftoken=40f73c7eff3411ebb3d43b267d3d6f31; _ga=GA1.2.1141160309.1629188548; _gid=GA1.2.2123001208.1629188548; ebGAClientId=1141160309.1629188548; _gat=1; SERVERID=djc19; SP=AGQgbbl-ISdJYnbsiyatl5Gw_A7IQfWe6JxPaGgc2ayQG0E2PCvPdxzHGH7uQduoCSoc00HOWM8ywALeL45IHueruQfyrOp_PY-7tAYPzqX8NppbabaAx4al_1QnyeoTeVlSQ19VIcjUIfY_YqRfhRTuDYuVCs-C6qipj-vyKn9ae9Xrdt0udhPgtJP9kRV26fENKb8zAaAXVuO6FqUfPaSaFbMnk8ma2u7YUcMS3OMbkirrNx1aXng; _dd_s=rum=0&expire=1629189463915'
    data = {
        "event_search": {
            "q": "tech",
            "dates": "current_future",
            "dedup":True,
            "places": [
                "85977539"
            ],
            "page":  1,
            "page_size": 100,
            "online_events_only":False,
            "client_timezone": "America/New_York"
        },
        "expand.destination_event": [
            "primary_venue",
            "image",
            "ticket_availability",
            "saves",
            "my_collections",
            "event_sales_status",
            "primary_organizer"
        ],
        "debug_experiment_overrides": {
            "search_exp_3": "C"
        }
    }
    resp = requests.post(url, headers=headers, data=json.dumps(data))
    events = json.loads(resp.content)

    random.shuffle(events["events"]["results"])
    my_results = [
        {
            "event_url":x["parent_url"] if x["parent_url"] != None else x["tickets_url"]  ,
            "location_type_id":"online" if x["is_online_event"] else "in-person",
            "title":x["name"],
            "img_url":x.get("image").get("url"),
            "desc":x.get("summary") if x.get("summary") else x.get("primary_organizer").get("summary")
        }
        for x in events["events"]["results"] if x.get("image") != None
    ]

    return my_results


  def grab_events(self,mysql_manager):
    try:
      is_today_info = mysql_manager.retrieve_entity_retrieval_date(
        mysql_manager.entity_enums.EVENTS
      )
      if is_today_info.get("is_today") != True:

        mysql_manager.update_entity_retrieval_date(
          mysql_manager.entity_enums.EVENTS
        )

        content = self.retrieve_events()
        mysql_manager.clear_entity_table(
          mysql_manager.entity_enums.EVENTS
        )
        random.shuffle(content)
        mysql_manager.insert_into_events_table(content)
    except BaseException as e:
      exit(e)










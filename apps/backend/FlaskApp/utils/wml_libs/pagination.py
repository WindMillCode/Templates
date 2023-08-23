import json
import math
from flask.json import jsonify


class WMLAPIPaginationRequestModel:
    def __init__(self, **kwargs):
        self.filter = []
        self.sort = []
        self.page_num = 0
        self.page_size = 0
        self.errorOccuredIsPresent = False

        # Update properties based on provided keyword arguments
        if kwargs:
            self.__dict__.update(kwargs)


        for k,v in self.__dict__.items():

            self[k] = v

    _data = {}


    def __setitem__(self, key, value):
        self._data[key] = value

    def __getitem__(self, key):
        return self._data[key]

    def to_json(self):
        return self.__dict__


class WMLAPIPaginationResponseModel:
    def __init__(self, **kwargs):
        self.columns = kwargs.get("columns", [])
        self.data = kwargs.get("data", [])
        self.page_num = kwargs.get("page_num", 0)
        self.page_size = kwargs.get("page_size", 0)
        self.total_pages = kwargs.get("total_pages", 0)
        self.total_items = kwargs.get("total_items", 0)

    def to_json(self):
        return self.__dict__

    def calculate_current_state(self,total_pages=None,total_items=None,page_size=None):
        if total_items:
            display_page_num = self.page_num+1
            self.page_size = len(self.data)
            self.total_items = total_items
            self.total_pages = math.ceil(total_items/page_size)
        else:
            display_page_num = self.page_num+1
            total_pages = total_pages if total_pages else display_page_num
            self.page_size =  len(self.data)
            self.total_pages = total_pages
            self.total_items = total_pages * len(self.data)

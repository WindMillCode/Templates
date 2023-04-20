from utils.singleton_exception import SingletonException


def local_deps():
  import sys
  if sys.platform == 'win32':
    sys.path.append(sys.path[0] + '.\site-packages\windows')
  elif sys.platform =='linux':
    sys.path.append(sys.path[0] + './site-packages/linux')
  elif sys.platform =='darwin':
    sys.path.append(sys.path[0] + './site-packages/linux')
local_deps()
from sqlalchemy.engine.create import create_engine

class PostgresManager():
  init= False
  client = None
  sqlalchemy_0_engine = ""
  sqlalchemy_0_conn = ""
  def __init__(self,conn_obj):
    if(self.init):
      raise SingletonException
    else:
      self.init = True
      self.set_up_sql_conn(conn_obj)


  def set_up_sql_conn(self,conn_obj):
      global sqlalchemy_0_engine
      conn_string = "postgresql://{}:{}@{}:{}/{}".format(
        conn_obj["user"],
        conn_obj["pass"],
        conn_obj["host"],
        conn_obj["port"],
        conn_obj["db"],

      )
      self.sqlalchemy_0_engine = create_engine(conn_string,pool_pre_ping=True)
      self.sqlalchemy_0_conn = self.sqlalchemy_0_engine.connect()


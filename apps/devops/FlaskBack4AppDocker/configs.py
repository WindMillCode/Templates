import os
from db.mysql_manager import MySQLManager
from managers.blog_manager import BlogManager
from managers.email_manager import EmailManager
from managers.events_manager import EventsManager
from managers.sentry_manager import SentryManager
from managers.watchdog_manager import WatchdogManager
from utils.env_vars import ENV_VARS
from utils.local_deps import  local_deps
from utils.run_cron_tasks import CronTasksRunner
local_deps()

class DevConfigs:

  endpointMsgCodes = {
    'success':'OK',
    'error':'ERROR',
  }


  app= {
    'access_control_allow_origin':['https://example.com:4200','https://example.com:4201'],
    'server_name':'example.com:5000',
    'domain_name':'https://example.com:5000',
    'flask_env':'development',
    'frontend_angular_app_url':'https://example.com:4200',
    'frontend_angular_app_domain':'example.com'
  }

  def __init__(self):
    None

  mysql_manager = None

  blog_manager = BlogManager(ENV_VARS.get("NEWS_API_KEY"))
  events_manager = EventsManager(ENV_VARS.get("EVENTBRITE_OAUTH_TOKEN"))
  # mysql_manager = MySQLManager(ENV_VARS.get("SQLALCHEMY_MYSQL_0_CONN_STRING"))
  email_manager= EmailManager(ENV_VARS.get("RESTDBIO_SERVER_API_KEY_0"))
  sentry_manager = SentryManager()
  watchdog_manager = WatchdogManager()
  cron_task_runner =  CronTasksRunner()

class TestConfigs(DevConfigs):
  None

class PreviewConfigs(DevConfigs):

  def __init__(self) -> None:
    super().__init__()
    self.app['flask_env'] = 'production'
    self.app['access_control_allow_origin'] = ["https://windmillcodesite.web.app"]
    self.app.pop('server_name')
    self.app.pop('domain_name')
    self.app['frontend_angular_app_url'] = "https://windmillcodesite.web.app"
    self.app['frontend_angular_app_domain'] = "windmillcodesite.web.app"

class ProdConfigs(DevConfigs):

  def __init__(self) -> None:
    super().__init__()
    self.app['flask_env'] = 'production'
    self.app['access_control_allow_origin'] = ["https://www.windmillcode.com"]
    self.app.pop('server_name')
    self.app.pop('domain_name')
    self.app['frontend_angular_app_url'] = "https://www.windmillcode.com"
    self.app['frontend_angular_app_domain'] = "www.windmillcode.com"



CONFIGS:DevConfigs= {
  'PROD':lambda x:ProdConfigs(),
  'PREVIEW':lambda x:PreviewConfigs(),
  'DEV':lambda x:DevConfigs(),
  'TEST':lambda x:TestConfigs(),
}[ENV_VARS.get("FLASK_BACKEND_ENV")](None)












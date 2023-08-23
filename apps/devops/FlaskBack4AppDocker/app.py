import asyncio
import os
import sys
import traceback

from configs import CONFIGS,ENV_VARS

import utils.my_util
from utils.my_util import APIMsgFormat
from utils.api_exceptions import APIError
from utils.local_deps import  local_deps
from utils.print_if_dev import print_if_dev
local_deps()
from flask.helpers import make_response
from flask.json import jsonify
from flask import Flask, request, redirect
import sqlalchemy

# dev additions
from endpoints.healthcheck_endpoint import healthcheck_endpoint
from endpoints.my_blog import myblog
from endpoints.my_events import myevents
from endpoints.contact_endpoint import contact_endpoint

CONFIGS.sentry_manager.init_sentry()
app = Flask(__name__)
app.config.update(
    FLASK_ENV = CONFIGS.app['flask_env'],
    SECRET_KEY=os.environ.get("FLASK_SOCKET_IO_SECRET_KEY"),
    DEBUG = False,
)
if ENV_VARS.get("FLASK_BACKEND_ENV") == "DEV":
  app.config.update(
    DEBUG = True
  )

app.register_blueprint(healthcheck_endpoint)
app.register_blueprint(myblog)
app.register_blueprint(myevents)
app.register_blueprint(contact_endpoint)

# @app.before_request
# def before_request():
#   if not request.is_secure:
#     url = request.url.replace('http://', 'https://', 1)
#     code = 301
#     return redirect(url, code=code)


@app.after_request
def after_request(response):
  origin =  request.headers.get('Origin',"")

  if origin in CONFIGS.app['access_control_allow_origin'] or CONFIGS.app['access_control_allow_origin'][0] == '*':
    response.headers.add('Access-Control-Allow-Origin', origin)
  response.headers.add('Access-Control-Allow-Headers', 'Cookie,Content-Type,Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers')
  # response.headers.add('Access-Control-Allow-Headers','*')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH')
  response.headers.add('Access-Control-Allow-Credentials','true')
  response.headers.add('Allow-Origin-With-Credentials','true')
  del response.headers["Server"]


  return response

@app.errorhandler(sqlalchemy.exc.PendingRollbackError)
def restart_because_of_socket_error(my_event):
  print_if_dev(my_event.__class__)
  # CONFIGS.sentry_manager.
  response = APIMsgFormat({},"There was an issue with the DB connection")
  my_resp = make_response(jsonify(response.__dict__))
  my_resp.status_code = 500
  return my_resp


@app.errorhandler(APIError)
def handle_api_exception(err):
    """Return custom JSON when APIError or its children are raised"""
    response = APIMsgFormat({},err.description)
    if len(err.args) > 0:
        response.msg = err.args[0]
    # Add some logging so that we can monitor different types of errors
    app.logger.error( "{} : {}".format(err.description, response.msg ))
    my_resp = make_response(jsonify(response.__dict__))
    my_resp.status_code = err.code
    return my_resp


@app.errorhandler(500)
def handle_unknown_exception(err):
    """Return JSON instead of HTML for any other server error"""
    print(err)
    app.logger.error(f"Unknown Exception: {str(err)}")
    # app.logger.debug(''.join(traceback.format_exception(etype=type(err), value=err, tb=err.__traceback__)))
    response = APIMsgFormat({},"This is a server error please contact support if the issue persits")


    return jsonify(response.__dict__), 500

@app.teardown_appcontext
def app_shutdown(event):
  CONFIGS.cron_task_runner.stop_task()



app.add_url_rule('/', 'index', (lambda: "hello world"))

if __name__ == "__main__":
    # CONFIGS.cron_task_runner.run_cron_tasks(CONFIGS)
    if ENV_VARS.get("FLASK_BACKEND_ENV") == "DEV":
      port = 5001
      # IMPORTANT: do not set this in run_backend_env this is a part of your
      # computers system env vars and you should set it seprately in an admin shell or CMD or powershell
      ssl_cert = ENV_VARS.get("WML_CERT0","cert.pem")
      ssl_key  = ENV_VARS.get("WML_CERT_KEY0","key.pem")
      app.run(
        use_reloader=True,
        exclude_patterns="site-packages",
        debug=True,ssl_context=(ssl_cert,ssl_key),port=port)

    else:
      app.run()


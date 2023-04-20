def local_deps():
    import sys
    if sys.platform == "win32":
        sys.path.append(sys.path[0] + "\\site-packages\\windows")
    elif sys.platform =="linux":
        sys.path.append(sys.path[0] + "/site-packages/linux")
    elif sys.platform =="darwin":
        sys.path.append(sys.path[0] + "/site-packages/linux")
local_deps()
import pprint
pp = pprint.PrettyPrinter(indent=2, compact=False, width=1)
from configs import ENV_VARS

def print_if_dev(item,pretty=False):
    if ENV_VARS.get("FLASK_BACKEND_ENV") == "DEV":
        if pretty == True:
          pp.pprint(item)
        else:
          print(item)

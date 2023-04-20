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
import textrazor

class TextRazorManager():
  init= False
  client = None
  def __init__(self,api_key):
    if(self.init):
      raise SingletonException
    else:
      self.init = True
      textrazor.api_key = api_key
      self.client = textrazor.TextRazor(extractors=["work experience", "projects" , "tools and technologies", "certifications"])

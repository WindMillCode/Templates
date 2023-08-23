from io import BytesIO
import json
import os
import random
from utils.env_vars import ENV_VARS
from utils.singleton_exception import SingletonException
from utils.local_deps import  local_deps
local_deps()
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph,Spacer
import json

class ReportlabManager():
  init= False
  def __init__(self):
    if(self.init):
      raise SingletonException
    else:
      self.init = True

  def to_html(self, json_doc):
      return json2html.convert(json=json_doc)

  def to_pdf(self, html_str):
      return pdfkit.from_string(html_str, None)

  def to_pdf_from_json(self,json_doc):
    return self.to_pdf(self.to_html(json_doc))

  def create_pdf_from_json(self,title,content):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()
    title_style = styles['Title']
    preformatted_style = styles['Code']
    preformatted_style.fontFamily = 'MyMonospaceFont'

    title_paragraph = Paragraph(title, title_style)
    formatted_json_paragraph = Paragraph(content, preformatted_style)

    story = [title_paragraph, Spacer(0, 10),formatted_json_paragraph]
    doc.build(story)
    return buffer.read()



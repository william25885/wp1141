# Vercel Serverless Function entry point
# This file is used by Vercel to handle API requests

import sys
import os

# 添加 backend 目錄到 Python 路徑
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import app

# Vercel expects the app to be accessible
# The @vercel/python runtime will handle the WSGI conversion
handler = app

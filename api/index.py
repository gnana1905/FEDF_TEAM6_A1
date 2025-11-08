"""
Vercel Serverless Function Wrapper for Flask App
This file adapts the Flask app to work in Vercel's serverless environment.

Vercel's @vercel/python runtime automatically converts WSGI applications
(like Flask) into serverless functions. We just need to import and export
the Flask app instance.
"""
import sys
import os

# Add parent directory to path to import app
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Import the Flask app
# Vercel will automatically handle the WSGI conversion
from app import app

# Vercel's Python runtime automatically detects WSGI apps
# No need for a custom handler function


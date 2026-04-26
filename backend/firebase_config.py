import os

from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()

_firebase_app = None
_firestore_client = None


def get_firestore_client():
    global _firebase_app, _firestore_client
    if _firestore_client is not None:
        return _firestore_client

    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "").strip()
    if not service_account_path:
        raise RuntimeError("FIREBASE_SERVICE_ACCOUNT_PATH is not configured.")

    if _firebase_app is None:
        cred = credentials.Certificate(service_account_path)
        _firebase_app = firebase_admin.initialize_app(cred)

    _firestore_client = firestore.client()
    return _firestore_client


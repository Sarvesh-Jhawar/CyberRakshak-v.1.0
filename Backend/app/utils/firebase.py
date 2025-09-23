import os
from typing import Optional, List
from datetime import datetime, timezone
import firebase_admin
from firebase_admin import credentials, firestore
from app.config import settings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


# -----------------------------
# Firebase Initialization
# -----------------------------
def initialize_firebase() -> firestore.client:
    """
    Initialize Firebase Admin SDK and return Firestore client.
    Handles service account file or environment variable credentials.
    """
    try:
        # If already initialized, return existing client
        if firebase_admin._apps:
            return firestore.client()

        # Use service account file if specified
        if os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH"):
            cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH"))
        else:
            # Use individual environment variables
            cred_dict = {
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "private_key_id": settings.FIREBASE_PRIVATE_KEY_ID,
                "private_key": settings.FIREBASE_PRIVATE_KEY.replace('\\n', '\n'),
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
                "client_id": settings.FIREBASE_CLIENT_ID,
                "auth_uri": settings.FIREBASE_AUTH_URI,
                "token_uri": settings.FIREBASE_TOKEN_URI,
                "auth_provider_x509_cert_url": settings.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
                "client_x509_cert_url": settings.FIREBASE_CLIENT_X509_CERT_URL
            }
            cred = credentials.Certificate(cred_dict)

        # Initialize Firebase app
        firebase_admin.initialize_app(cred, {
            "databaseURL": settings.DATABASE_URL
        })

        return firestore.client()

    except Exception as e:
        print(f"[Firebase Init Error] {e}")
        raise e


# -----------------------------
# Firestore Client Access
# -----------------------------
def get_firestore_client() -> firestore.client:
    """
    Return Firestore client instance.
    Initializes Firebase if not already initialized.
    """
    try:
        return firestore.client()
    except ValueError:
        return initialize_firebase()


# -----------------------------
# Firebase Database Wrapper
# -----------------------------
class FirebaseDB:
    def __init__(self):
        self.db = get_firestore_client()

    def create_document(self, collection: str, document_id: str, data: dict) -> bool:
        try:
            self.db.collection(collection).document(document_id).set(data)
            return True
        except Exception as e:
            print(f"[Create Document Error] {e}")
            return False

    def get_document(self, collection: str, document_id: str) -> Optional[dict]:
        try:
            doc = self.db.collection(collection).document(document_id).get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            print(f"[Get Document Error] {e}")
            return None

    def update_document(self, collection: str, document_id: str, data: dict) -> bool:
        try:
            self.db.collection(collection).document(document_id).update(data)
            return True
        except Exception as e:
            print(f"[Update Document Error] {e}")
            return False

    def delete_document(self, collection: str, document_id: str) -> bool:
        try:
            self.db.collection(collection).document(document_id).delete()
            return True
        except Exception as e:
            print(f"[Delete Document Error] {e}")
            return False

    def get_collection(self, collection: str, filters: Optional[List[tuple]] = None) -> list:
        """
        Get all documents from a collection.
        Optional filters: List of tuples [(field, operator, value), ...]
        """
        try:
            query = self.db.collection(collection)
            if filters:
                for field, operator, value in filters:
                    query = query.where(field, operator, value)
            docs = query.stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"[Get Collection Error] {e}")
            return []

    def query_documents(self, collection: str, field: str, operator: str, value) -> list:
        try:
            docs = self.db.collection(collection).where(field, operator, value).stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"[Query Documents Error] {e}")
            return []


# -----------------------------
# Timestamp Helper
# -----------------------------
def get_timestamp() -> str:
    """Return current UTC timestamp in ISO format"""
    return datetime.now(timezone.utc).isoformat()


# -----------------------------
# Global Database Instance
# -----------------------------
db = FirebaseDB()

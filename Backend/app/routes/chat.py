from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.utils.firebase import db
from app.utils.auth import get_current_user
from app.models.chat import ChatMessage

router = APIRouter(tags=["Chat"])

@router.get("/api/v1/chat/history", response_model=List[ChatMessage])
async def get_chat_history(
    current_user: dict = Depends(get_current_user),
    conversation_id: Optional[str] = None
):
    """
    Retrieve chat history for the current user.
    Optionally filter by conversation_id.
    """
    user_id = current_user["id"]
    
    filters = [("user_id", "==", user_id)]
    if conversation_id:
        filters.append(("conversation_id", "==", conversation_id))

    try:
        # Fetch documents from Firestore, ordered by timestamp
        chat_docs = db.get_collection("chats", filters=filters)
        
        # Sort by timestamp as Firestore query.stream() doesn't guarantee order with multiple filters
        chat_docs.sort(key=lambda x: x.get("timestamp", ""))

        return [ChatMessage(**doc) for doc in chat_docs]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve chat history: {e}"
        )

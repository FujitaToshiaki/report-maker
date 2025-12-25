from typing import Annotated, Literal, TypedDict

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class ConversationState(TypedDict):
    """State for the conversation graph.

    Attributes:
        messages: List of chat messages with add_messages reducer for proper message handling
        character_id: ID of the character conducting the interview
        report_type: Type of report being generated (trip, defect, seminar)
        purpose: Optional purpose for trip reports
        question_count: Number of questions (assistant messages) asked so far
        is_complete: Whether the conversation has reached its conclusion
    """

    messages: Annotated[list[BaseMessage], add_messages]
    character_id: str
    report_type: Literal["trip", "defect", "seminar"]
    purpose: str | None
    question_count: int
    is_complete: bool

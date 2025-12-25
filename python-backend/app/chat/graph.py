"""LangGraph-based conversation flow for the report-maker chat system.

This module implements a state machine using LangGraph to manage the conversation
flow with proper state management, question counting, and automatic closing.
"""

import os
from typing import Any

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import END, StateGraph
from langgraph.graph.state import CompiledStateGraph

from app.chat.characters import (
    CHARACTER_PROMPTS,
    CLOSING_MESSAGES,
    DEFAULT_CLOSING_MESSAGE,
)
from app.chat.state import ConversationState

MAX_QUESTIONS = 5
MESSAGE_HISTORY_LIMIT = 10


def get_llm() -> ChatOpenAI:
    """Get the ChatOpenAI instance with the configured model.
    
    Note: OPENAI_API_KEY is automatically picked up from environment variables.
    """
    return ChatOpenAI(model="gpt-5")


def count_questions(state: ConversationState) -> dict[str, Any]:
    """Count the number of assistant messages (questions) in the conversation.

    This node updates the question_count based on the number of AI messages
    in the conversation history.
    """
    messages = state["messages"]
    question_count = sum(1 for msg in messages if isinstance(msg, AIMessage))
    return {"question_count": question_count}


def check_completion(state: ConversationState) -> str:
    """Check if the conversation should be completed.

    Returns the next node to route to based on the question count.
    """
    if state["question_count"] >= MAX_QUESTIONS:
        return "generate_closing"
    return "generate_response"


def generate_response(state: ConversationState) -> dict[str, Any]:
    """Generate an AI response using the character's system prompt.

    This node:
    1. Builds the system prompt with character personality
    2. Adds purpose context for trip reports
    3. Trims message history to prevent token overflow
    4. Adds wrap-up instruction for the 5th question
    5. Calls the LLM to generate a response
    """
    character_id = state["character_id"]
    report_type = state["report_type"]
    purpose = state.get("purpose")
    messages = state["messages"]
    question_count = state["question_count"]

    character = CHARACTER_PROMPTS.get(character_id)
    if not character:
        raise ValueError(f"Unknown character: {character_id}")

    system_prompt = character["system_prompt"]
    if report_type == "trip" and purpose:
        system_prompt = (
            f"{system_prompt}\n\n"
            f"【出張目的】\nユーザーの出張目的は「{purpose}」です。"
            "この目的を念頭に置いて、自然な会話の流れで質問してください。"
        )

    trimmed_messages = messages[-MESSAGE_HISTORY_LIMIT:]

    chat_messages: list[SystemMessage | HumanMessage | AIMessage] = [
        SystemMessage(content=system_prompt)
    ]

    for msg in trimmed_messages:
        if isinstance(msg, (HumanMessage, AIMessage)):
            chat_messages.append(msg)

    if question_count == MAX_QUESTIONS - 1:
        chat_messages.append(
            SystemMessage(content="これが最後の質問です。次の応答で会話を自然に締めくくってください。")
        )

    llm = get_llm()
    response = llm.invoke(chat_messages)

    return {"messages": [response]}


def generate_closing(state: ConversationState) -> dict[str, Any]:
    """Generate a closing message when the conversation is complete.

    This node returns a predefined closing message based on the character
    and marks the conversation as complete.
    """
    character_id = state["character_id"]
    closing_message = CLOSING_MESSAGES.get(character_id, DEFAULT_CLOSING_MESSAGE)

    return {
        "messages": [AIMessage(content=closing_message)],
        "is_complete": True,
    }


def create_chat_graph() -> CompiledStateGraph:
    """Create and compile the conversation state graph.

    The graph has the following structure:
    1. count_questions: Count assistant messages
    2. Conditional routing based on question count:
       - If >= 5 questions: route to generate_closing
       - Otherwise: route to generate_response
    3. generate_response: Generate AI response
    4. generate_closing: Generate closing message and end

    Returns:
        Compiled StateGraph for conversation management
    """
    workflow = StateGraph(ConversationState)

    workflow.add_node("count_questions", count_questions)
    workflow.add_node("generate_response", generate_response)
    workflow.add_node("generate_closing", generate_closing)

    workflow.set_entry_point("count_questions")

    workflow.add_conditional_edges(
        "count_questions",
        check_completion,
        {
            "generate_response": "generate_response",
            "generate_closing": "generate_closing",
        },
    )

    workflow.add_edge("generate_response", END)
    workflow.add_edge("generate_closing", END)

    return workflow.compile()


async def run_chat(
    messages: list[dict[str, str]],
    character_id: str,
    report_type: str,
    purpose: str | None = None,
) -> str:
    """Run the chat graph with the given inputs.

    Args:
        messages: List of message dicts with 'role' and 'content' keys
        character_id: ID of the character to use
        report_type: Type of report (trip, defect, seminar)
        purpose: Optional purpose for trip reports

    Returns:
        The AI's response message content
    """
    langchain_messages: list[BaseMessage] = []
    for msg in messages:
        if msg["role"] == "user":
            langchain_messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            langchain_messages.append(AIMessage(content=msg["content"]))

    initial_state: ConversationState = {
        "messages": langchain_messages,
        "character_id": character_id,
        "report_type": report_type,  # type: ignore[typeddict-item]
        "purpose": purpose,
        "question_count": 0,
        "is_complete": False,
    }

    graph = create_chat_graph()
    result = await graph.ainvoke(initial_state)

    final_messages = result["messages"]
    if final_messages:
        last_message = final_messages[-1]
        if isinstance(last_message, AIMessage):
            return str(last_message.content)

    raise ValueError("No response generated")

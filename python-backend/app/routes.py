"""API routes for the report-maker backend.

This module defines the FastAPI routes that match the existing frontend expectations.
"""

from typing import Any, Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.chat.graph import run_chat
from app.report.generator import generate_report

router = APIRouter(prefix="/api")


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    characterId: str = Field(alias="characterId")
    reportType: Literal["trip", "defect", "seminar"] | None = Field(
        default=None, alias="reportType"
    )
    purpose: str | None = None

    class Config:
        populate_by_name = True


class ChatResponse(BaseModel):
    message: str


class GenerateReportRequest(BaseModel):
    messages: list[ChatMessage]
    reportType: Literal["trip", "defect", "seminar"] = Field(alias="reportType")
    basicInfo: dict[str, Any] = Field(alias="basicInfo")

    class Config:
        populate_by_name = True


class GenerateReportResponse(BaseModel):
    report: dict[str, Any]


class ErrorResponse(BaseModel):
    error: str


@router.post("/chat", response_model=ChatResponse, responses={400: {"model": ErrorResponse}})
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """Handle chat messages with character-based responses.

    This endpoint processes user messages and generates AI responses
    using the specified character's personality and Toyama dialect.
    """
    if not request.messages or not request.characterId:
        raise HTTPException(status_code=400, detail="必須フィールドが不足しています")

    try:
        messages_dict = [{"role": msg.role, "content": msg.content} for msg in request.messages]

        response = await run_chat(
            messages=messages_dict,
            character_id=request.characterId,
            report_type=request.reportType or "trip",
            purpose=request.purpose,
        )

        return ChatResponse(message=response)

    except ValueError as e:
        error_message = str(e)
        if "トークン制限" in error_message or "AIからの応答" in error_message:
            raise HTTPException(status_code=400, detail=error_message)
        raise HTTPException(status_code=500, detail="応答の生成に失敗しました。もう一度お試しください。")

    except Exception as e:
        print(f"Chat API error: {e}")
        raise HTTPException(status_code=500, detail="応答の生成に失敗しました。もう一度お試しください。")


@router.post(
    "/generate-report",
    response_model=GenerateReportResponse,
    responses={400: {"model": ErrorResponse}},
)
async def generate_report_endpoint(request: GenerateReportRequest) -> GenerateReportResponse:
    """Generate a structured report from chat history.

    This endpoint processes the chat history and generates a structured
    report based on the specified report type.
    """
    if not request.messages or not request.reportType or not request.basicInfo:
        raise HTTPException(status_code=400, detail="必須フィールドが不足しています")

    try:
        messages_dict = [{"role": msg.role, "content": msg.content} for msg in request.messages]

        report = await generate_report(
            messages=messages_dict,
            report_type=request.reportType,
            basic_info=request.basicInfo,
        )

        return GenerateReportResponse(report=report)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        print(f"Report generation error: {e}")
        raise HTTPException(status_code=500, detail="報告書の生成に失敗しました。もう一度お試しください。")

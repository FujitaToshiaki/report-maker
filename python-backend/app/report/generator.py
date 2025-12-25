"""Report generation module using LangChain for structured output.

This module generates structured reports from chat history using OpenAI's
JSON mode for reliable structured output.
"""

import json
import os
from typing import Any, Literal

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field


class TripReportIssue(BaseModel):
    issue: str = Field(description="課題")
    cause: str = Field(description="原因")


class TripReportAction(BaseModel):
    action: str = Field(description="アクション項目")
    deadline: str = Field(description="期限")
    person: str = Field(description="担当者")


class TripReport(BaseModel):
    purpose: str = Field(description="出張の目的（1-2文）")
    activities: list[str] = Field(description="活動内容リスト")
    achievements: list[str] = Field(description="成果リスト")
    issues: list[TripReportIssue] = Field(description="課題と原因のリスト")
    actions: list[TripReportAction] = Field(description="アクション項目リスト")
    impression: str = Field(description="所感（2-3文）")


class SeminarReport(BaseModel):
    summary: str = Field(description="セミナーの概要（2-3文）")
    learnings: list[str] = Field(description="学んだことリスト")
    insights: list[str] = Field(description="気づきリスト")
    applications: list[str] = Field(description="今後の活用方法リスト")


class FourM(BaseModel):
    man: str = Field(description="作業者要因")
    machine: str = Field(description="設備要因")
    material: str = Field(description="材料要因")
    method: str = Field(description="作業方法要因")


class FiveWhy(BaseModel):
    why1: str = Field(description="なぜ1")
    why2: str = Field(description="なぜ2")
    why3: str = Field(description="なぜ3")
    why4: str = Field(description="なぜ4")
    why5: str = Field(description="なぜ5（真因）")


class DefectReport(BaseModel):
    defectDescription: str = Field(description="不良内容の詳細説明")
    fourM: FourM = Field(description="4M分析")
    fiveWhy: FiveWhy = Field(description="5Why分析")
    immediateAction: str = Field(description="応急処置")
    permanentAction: str = Field(description="恒久対策")
    horizontalDeployment: str = Field(description="水平展開")
    effectConfirmation: str = Field(description="効果確認方法")


TRIP_REPORT_SYSTEM_PROMPT = """あなたは出張報告書を作成する専門家です。以下のチャット履歴から、構造化された出張報告書を生成してください。

報告書は以下の形式のJSON形式で返してください：
{
  "purpose": "出張の目的（1-2文）",
  "activities": ["活動内容1", "活動内容2", ...],
  "achievements": ["成果1", "成果2", ...],
  "issues": [{"issue": "課題", "cause": "原因"}],
  "actions": [{"action": "アクション項目", "deadline": "期限", "person": "担当者"}],
  "impression": "所感（2-3文）"
}

- activities: 時系列で具体的な活動内容をリストアップ
- achievements: 定量的な成果を含めて記載
- issues: 発生した課題とその原因を明確に
- actions: 具体的なアクション項目、期限、担当者を記載
- impression: 全体的な所感や今後の展望"""

SEMINAR_REPORT_SYSTEM_PROMPT = """あなたはセミナー参加報告書を作成する専門家です。以下のチャット履歴から、構造化されたセミナー参加報告書を生成してください。

報告書は以下の形式のJSON形式で返してください：
{
  "summary": "セミナーの概要（2-3文）",
  "learnings": ["学んだこと1", "学んだこと2", ...],
  "insights": ["気づき1", "気づき2", ...],
  "applications": ["今後の活用方法1", "今後の活用方法2", ...]
}

- summary: セミナーの主要テーマと内容の概要
- learnings: 具体的に学んだ知識やスキル
- insights: 個人的な気づきや発見
- applications: 業務への具体的な活用方法"""

DEFECT_REPORT_SYSTEM_PROMPT = """あなたは不良品報告書を作成する専門家です。以下のチャット履歴から、構造化された不良品報告書を生成してください。

報告書は以下の形式のJSON形式で返してください：
{
  "defectDescription": "不良内容の詳細説明",
  "fourM": {
    "man": "作業者要因",
    "machine": "設備要因",
    "material": "材料要因",
    "method": "作業方法要因"
  },
  "fiveWhy": {
    "why1": "なぜ1",
    "why2": "なぜ2",
    "why3": "なぜ3",
    "why4": "なぜ4",
    "why5": "なぜ5（真因）"
  },
  "immediateAction": "応急処置",
  "permanentAction": "恒久対策",
  "horizontalDeployment": "水平展開",
  "effectConfirmation": "効果確認方法"
}"""


def get_llm() -> ChatOpenAI:
    """Get the ChatOpenAI instance configured for JSON output.
    
    Note: OPENAI_API_KEY is automatically picked up from environment variables.
    """
    return ChatOpenAI(
        model="gpt-4o",
        model_kwargs={"response_format": {"type": "json_object"}},
    )


def format_messages_for_prompt(messages: list[dict[str, str]]) -> str:
    """Format chat messages for inclusion in the prompt."""
    formatted = []
    for msg in messages:
        role = "ユーザー" if msg["role"] == "user" else "AI"
        formatted.append(f"{role}: {msg['content']}")
    return "\n\n".join(formatted)


async def generate_report(
    messages: list[dict[str, str]],
    report_type: Literal["trip", "seminar", "defect"],
    basic_info: dict[str, Any],
) -> dict[str, Any]:
    """Generate a structured report from chat history.

    Args:
        messages: List of chat messages with 'role' and 'content' keys
        report_type: Type of report to generate
        basic_info: Basic information about the report (dates, names, etc.)

    Returns:
        Structured report as a dictionary

    Raises:
        ValueError: If report_type is invalid or response is empty
    """
    if report_type == "trip":
        system_prompt = TRIP_REPORT_SYSTEM_PROMPT
    elif report_type == "seminar":
        system_prompt = SEMINAR_REPORT_SYSTEM_PROMPT
    elif report_type == "defect":
        system_prompt = DEFECT_REPORT_SYSTEM_PROMPT
    else:
        raise ValueError(f"Invalid report type: {report_type}")

    basic_info_str = json.dumps(basic_info, ensure_ascii=False, indent=2)
    chat_history = format_messages_for_prompt(messages)

    user_prompt = f"""以下は{_get_report_type_name(report_type)}についてのチャット履歴です。この内容から報告書を作成してください。

基本情報：
{basic_info_str}

チャット履歴：
{chat_history}

上記の内容を基に、構造化された報告書を生成してください。"""

    llm = get_llm()
    response = await llm.ainvoke(
        [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ]
    )

    content = response.content
    if not content or not isinstance(content, str):
        raise ValueError("AIからの応答が空です")

    report: dict[str, Any] = json.loads(content)
    return report


def _get_report_type_name(report_type: str) -> str:
    """Get the Japanese name for a report type."""
    names = {
        "trip": "出張",
        "seminar": "セミナー",
        "defect": "不良品",
    }
    return names.get(report_type, report_type)

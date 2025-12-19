import OpenAI from "openai";

// Using Replit AI Integrations - no API key required, charges billed to Replit credits
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function generateReport(
  messages: Message[],
  reportType: "trip" | "seminar" | "defect",
  basicInfo: any
) {
  try {
    let systemPrompt = "";
    let userPrompt = "";

    if (reportType === "trip") {
      systemPrompt = `あなたは出張報告書を作成する専門家です。以下のチャット履歴から、構造化された出張報告書を生成してください。

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
- impression: 全体的な所感や今後の展望`;

      userPrompt = `以下は出張についてのチャット履歴です。この内容から出張報告書を作成してください。

基本情報：
${JSON.stringify(basicInfo, null, 2)}

チャット履歴：
${messages.map((m) => `${m.role === "user" ? "ユーザー" : "AI"}: ${m.content}`).join("\n\n")}

上記の内容を基に、構造化された出張報告書を生成してください。`;
    } else if (reportType === "seminar") {
      systemPrompt = `あなたはセミナー参加報告書を作成する専門家です。以下のチャット履歴から、構造化されたセミナー参加報告書を生成してください。

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
- applications: 業務への具体的な活用方法`;

      userPrompt = `以下はセミナーについてのチャット履歴です。この内容からセミナー参加報告書を作成してください。

基本情報：
${JSON.stringify(basicInfo, null, 2)}

チャット履歴：
${messages.map((m) => `${m.role === "user" ? "ユーザー" : "AI"}: ${m.content}`).join("\n\n")}

上記の内容を基に、構造化されたセミナー参加報告書を生成してください。`;
    } else if (reportType === "defect") {
      systemPrompt = `あなたは不良品報告書を作成する専門家です。以下のチャット履歴から、構造化された不良品報告書を生成してください。

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
}`;

      userPrompt = `以下は不良品についてのチャット履歴です。この内容から不良品報告書を作成してください。

基本情報：
${JSON.stringify(basicInfo, null, 2)}

チャット履歴：
${messages.map((m) => `${m.role === "user" ? "ユーザー" : "AI"}: ${m.content}`).join("\n\n")}

上記の内容を基に、構造化された不良品報告書を生成してください。`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("AIからの応答が空です");
    }

    const report = JSON.parse(content);
    return report;
  } catch (error) {
    console.error("Report generation error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("報告書の生成に失敗しました");
  }
}

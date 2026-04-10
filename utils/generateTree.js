const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const generateLearningTree = async ({
  child,
  subject,
  level,
  percentage,
  questionIds,
}) => {
  const prompt = `
You are an expert special education AI for the Rafeeq platform.
Your job is to generate a personalized learning tree for a child with special needs.

Child profile:
- Special need type: ${child.special_need_type || "not specified"}
- Behavioral notes: ${child.behavioral_notes_en || "not provided"}
- Communication notes: ${child.communication_notes_en || "not provided"}
- Social notes: ${child.social_notes_en || "not provided"}
- Attention notes: ${child.attention_notes_en || "not provided"}
- Additional notes: ${child.additional_notes_en || "not provided"}

Subject: ${subject.name_en}
Level: ${level.title_en}
Level description: ${level.description_en || "not provided"}
Exam score: ${percentage}%

Available question IDs from the question bank for this level: ${JSON.stringify(questionIds)}

Based on the score generate tasks as follows:
- 0 to 49%: generate 6 tasks (critical level)
- 50 to 64%: generate 5 tasks (needs work level)
- 65 to 79%: generate 3 tasks (good level)
- 80 to 100%: generate 2 tasks (excellent level)

Mix task types (task, activity, quiz) based on the child's notes.
For quiz tasks use question IDs from the available list above.
For activity tasks use materials_needed_en and materials_needed_ar.
For task types use instructions_en and expected_outcome_en.

Return ONLY a valid JSON object with NO extra text, NO markdown, NO backticks:
{
  "ai_summary_en": "brief explanation of why this level was chosen and what the plan is",
  "ai_summary_ar": "نفس الملخص باللغة العربية",
  "tasks": [
    {
      "order": 1,
      "type": "task",
      "title_en": "",
      "title_ar": "",
      "instructions_en": "",
      "instructions_ar": "",
      "expected_outcome_en": "",
      "expected_outcome_ar": ""
    },
    {
      "order": 2,
      "type": "activity",
      "title_en": "",
      "title_ar": "",
      "instructions_en": "",
      "instructions_ar": "",
      "materials_needed_en": "",
      "materials_needed_ar": "",
      "expected_outcome_en": "",
      "expected_outcome_ar": ""
    },
    {
      "order": 3,
      "type": "quiz",
      "title_en": "",
      "title_ar": "",
      "instructions_en": "",
      "instructions_ar": "",
      "passing_score": 60,
      "question_ids": []
    }
  ]
}
`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

module.exports = { generateLearningTree };

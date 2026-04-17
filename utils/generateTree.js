const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateLearningTree = async ({ child, level, topic, questionIds }) => {
  const prompt = `
You are an expert special education AI for the Rafeeq platform.
Your job is to generate a personalized learning tree for a child with special needs.

Child profile:
- Special need type: ${child.learning_difficulty || "not specified"}
- Current level: ${level}
- Topic: ${topic}

Generate a personalized learning path for this child at level ${level}.
The tree should contain tasks appropriate for a child with ${child.learning_difficulty}.

Return ONLY a valid JSON object with NO extra text, NO markdown, NO backticks:
{
  "tasks": [
    {
      "order": 1,
      "content_type": "quiz",
      "title": "",
      "description": ""
    },
    {
      "order": 2,
      "content_type": "activity",
      "title": "",
      "description": ""
    },
    {
      "order": 3,
      "content_type": "homework",
      "title": "",
      "description": ""
    }
  ]
}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 3000,
    temperature: 0.7,
  });

  const text = response.choices[0].message.content;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

module.exports = { generateLearningTree };

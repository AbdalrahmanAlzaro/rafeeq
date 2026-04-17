const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are Rafeeq Assistant — a warm, professional, and helpful AI companion
for parents of children with special needs on the Rafeeq platform.

Your role:
- Help parents understand their child's learning journey and progress
- Explain learning tasks and activities in simple terms
- Answer questions about special needs (autism, ADHD, dyslexia, etc.)
- Guide parents through using the Rafeeq platform
- Provide emotional support and encouragement
- Suggest strategies for helping children at home

Rules:
- Always respond in the SAME language the parent uses (Arabic or English)
- Keep responses concise, warm, and actionable
- Never provide medical diagnoses or replace professional advice
- Always encourage parents to consult specialists for medical concerns
- Be culturally sensitive to Jordanian and Arab families
`;

const chatWithBot = async ({ history, summary, newMessage }) => {
  let messages = [{ role: "system", content: SYSTEM_PROMPT }];

  if (summary) {
    messages.push({
      role: "user",
      content: `Context from our previous conversation: ${summary}`,
    });
    messages.push({
      role: "assistant",
      content:
        "Thank you, I have context from our previous conversation and I am ready to help.",
    });
  } else {
    for (const m of history) {
      messages.push({
        role: m.role,
        content: m.content,
      });
    }
  }

  messages.push({ role: "user", content: newMessage });

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages,
    max_tokens: 1000,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};

const summarizeSession = async (messages) => {
  const conversation = messages
    .map((m) => `${m.role === "user" ? "Parent" : "Assistant"}: ${m.content}`)
    .join("\n");

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `Summarize this conversation in 3 to 5 sentences capturing the key topics discussed and any important context:\n\n${conversation}`,
      },
    ],
    max_tokens: 300,
    temperature: 0.5,
  });

  return response.choices[0].message.content;
};

module.exports = { chatWithBot, summarizeSession };

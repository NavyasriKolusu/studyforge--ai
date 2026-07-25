import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing. Add it to server/.env"
  );
}

const ai = new GoogleGenAI({
  apiKey,
});

export async function generateStudySet(
  topic: string
): Promise<unknown> {
  const prompt = `
You are the content generation engine for an interactive study application.

Create a study set from the user's topic or notes.

USER INPUT:
${topic}

Return ONLY valid JSON.

The JSON must have exactly this structure:

{
  "title": "Short study set title",
  "summary": "One or two sentence summary",
  "flashcards": [
    {
      "id": "flash-1",
      "question": "Question",
      "answer": "Clear concise answer"
    }
  ],
  "quiz": [
    {
      "id": "quiz-1",
      "question": "Question",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 0,
      "explanation": "Why the answer is correct"
    }
  ]
}

Rules:

- Generate between 5 and 10 flashcards.
- Generate between 5 and 10 quiz questions.
- Each quiz question must have exactly 4 options.
- correctAnswer is a zero-based array index.
- correctAnswer must therefore be 0, 1, 2, or 3.
- Questions must be based only on the supplied topic or notes.
- Keep explanations concise but educational.
- IDs must be unique.
- Do not include markdown.
- Do not include code fences.
- Do not include commentary before or after the JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;

  if (!text || !text.trim()) {
    throw new Error("The AI returned an empty response.");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("The AI returned malformed JSON.");
  }
}
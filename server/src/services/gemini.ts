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
You are the study-content engine for StudyForge, an interactive
AI-powered learning application.

Act as an expert university professor and technical interviewer.

The learner wants to study the following topic or notes:

"""
${topic}
"""

Create a high-quality study set based on the learner's input.

CONTENT GOALS:

1. Focus on conceptual understanding rather than simple memorization.

2. Identify the most important concepts from the topic.

3. When the topic is technical, include questions that are useful
   for university exams and technical interviews.

4. Include common misconceptions, differences between related
   concepts, or common mistakes when relevant.

5. Start with foundational concepts and gradually include
   intermediate or applied concepts.

6. Keep flashcard answers concise but educational.

7. Quiz explanations must teach the learner why the selected
   answer is correct.

8. Avoid repetitive or nearly identical questions.

9. Stay relevant to the learner's requested topic.

10. Do not invent specific facts that are unsupported when the
    learner provides detailed notes.

Return ONLY valid JSON.

The JSON must have exactly this structure:

{
  "title": "Concise study set title",

  "summary": "A useful 1-2 sentence overview of the topic",

  "flashcards": [
    {
      "id": "flash-1",
      "question": "Clear study question",
      "answer": "Concise educational answer"
    }
  ],

  "quiz": [
    {
      "id": "quiz-1",
      "question": "Quiz question",

      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],

      "correctAnswer": 0,

      "explanation":
        "A concise explanation of why this answer is correct"
    }
  ]
}

STRICT REQUIREMENTS:

- Generate between 7 and 10 flashcards.
- Generate between 7 and 10 quiz questions.
- Every flashcard must contain a meaningful question and answer.
- Every quiz question must contain exactly 4 options.
- Exactly one option must be correct.
- correctAnswer must be the zero-based index of the correct option.
- correctAnswer must therefore be 0, 1, 2, or 3.
- Every quiz question must include an explanation.
- Flashcard questions must not be duplicates.
- Quiz questions must not be duplicates.
- Options within a quiz question must not be duplicates.
- IDs must be unique.
- Do not output Markdown.
- Do not use code fences.
- Do not include commentary before the JSON.
- Do not include commentary after the JSON.
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
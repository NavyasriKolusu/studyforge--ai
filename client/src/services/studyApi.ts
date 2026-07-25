import { studySetSchema } from "../schemas/studySchema";
import type { StudySet } from "../types/study";

const API_URL = "http://localhost:3001";

interface GenerateResponse {
  data?: unknown;
  message?: string;
}

export async function generateStudySet(
  topic: string,
  signal?: AbortSignal
): Promise<StudySet> {
  const response = await fetch(
    `${API_URL}/api/generate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        topic,
      }),

      signal,
    }
  );

  let body: GenerateResponse;

  try {
    body = await response.json();
  } catch {
    throw new Error(
      "The server returned an unreadable response."
    );
  }

  if (!response.ok) {
    throw new Error(
      body.message ||
        "Unable to generate your study set."
    );
  }

  const validation =
    studySetSchema.safeParse(body.data);

  if (!validation.success) {
    console.error(
      "Client validation failed:",
      validation.error.issues
    );

    throw new Error(
      "The server returned an invalid study set."
    );
  }

  return validation.data;
}
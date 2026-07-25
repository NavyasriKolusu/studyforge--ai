import { studySetSchema } from "../schemas/studySchema";
import type { StudySet } from "../types/study";

const API_URL = "http://localhost:3001";
const REQUEST_TIMEOUT = 30000;

interface GenerateResponse {
  data?: unknown;
  error?: string;
  message?: string;
}

export async function generateStudySet(
  topic: string,
  externalSignal?: AbortSignal
): Promise<StudySet> {
  const timeoutController = new AbortController();

  const timeoutId = window.setTimeout(() => {
    timeoutController.abort();
  }, REQUEST_TIMEOUT);

  const abortFromExternalSignal = () => {
    timeoutController.abort();
  };

  externalSignal?.addEventListener(
    "abort",
    abortFromExternalSignal
  );

  try {
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

        signal: timeoutController.signal,
      }
    );

    let body: GenerateResponse;

    try {
      body = await response.json();
    } catch {
      throw new Error(
        "The server returned an unreadable response. Please try again."
      );
    }

    if (!response.ok) {
      throw new Error(
        body.message ||
          "Unable to generate your study set. Please try again."
      );
    }

    const validation =
      studySetSchema.safeParse(body.data);

    if (!validation.success) {
      console.error(
        "Client study set validation failed:",
        validation.error.issues
      );

      throw new Error(
        "The generated study set was incomplete. Please generate it again."
      );
    }

    return validation.data;
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      if (externalSignal?.aborted) {
        throw error;
      }

      throw new Error(
        "Generation is taking longer than expected. Please try again."
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to StudyForge. Check your connection and try again."
      );
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);

    externalSignal?.removeEventListener(
      "abort",
      abortFromExternalSignal
    );
  }
}
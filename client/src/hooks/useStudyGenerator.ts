import { useRef, useState } from "react";

import { generateStudySet } from "../services/studyApi";
import type { StudySet } from "../types/study";

export function useStudyGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const generate = async (
    topic: string
  ): Promise<StudySet | null> => {
    // Cancel any previous unfinished request.
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const studySet = await generateStudySet(
        topic,
        controller.signal
      );

      return studySet;
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return null;
      }

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while generating the study set."
      );

      return null;
    } finally {
      if (controllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    generate,
    loading,
    error,
    clearError,
  };
}
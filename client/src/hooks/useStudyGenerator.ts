import { useRef, useState } from "react";

import { generateStudySet } from "../services/studyApi";
import type { StudySet } from "../types/study";

export function useStudyGenerator() {
  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const controllerRef =
    useRef<AbortController | null>(null);

  const requestIdRef = useRef(0);

  const generate = async (
    topic: string
  ): Promise<StudySet | null> => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const studySet = await generateStudySet(
        topic,
        controller.signal
      );

      // Ignore a result belonging to an older request.
      if (requestId !== requestIdRef.current) {
        return null;
      }

      return studySet;
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return null;
      }

      if (requestId === requestIdRef.current) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
      }

      return null;
    } finally {
      if (requestId === requestIdRef.current) {
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
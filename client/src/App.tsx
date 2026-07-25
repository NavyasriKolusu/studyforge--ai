import { useState } from "react";

import TopicInput from "./components/TopicInput";
import StudyDashboard from "./components/StudyDashboard";
import FlashcardDeck from "./components/FlashcardDeck";
import Quiz from "./components/Quiz";

import { useStudyGenerator } from "./hooks/useStudyGenerator";

import type { StudySet } from "./types/study";

type Page =
  | "home"
  | "dashboard"
  | "flashcards"
  | "quiz";

function App() {
  const [page, setPage] = useState<Page>("home");

  const [studySet, setStudySet] =
    useState<StudySet | null>(null);

  const [lastTopic, setLastTopic] =
    useState("");  

  const {
    generate,
    loading,
    error,
    clearError,
  } = useStudyGenerator();

   const handleGenerate = async (topic: string) => {
  setLastTopic(topic);

  const generatedStudySet =
    await generate(topic);

  if (!generatedStudySet) {
    return;
  }

  setStudySet(generatedStudySet);
  setPage("dashboard");
};
  const reset = () => {
    setStudySet(null);
    clearError();
    setPage("home");
  };

  if (page === "home") {
    return (
      <>
        <TopicInput
          loading={loading}
          onGenerate={handleGenerate}
        />

        {error && (
  <div
    className="global-error"
    role="alert"
    aria-live="polite"
  >
    <strong>
      We couldn't create your study set.
    </strong>

    <p>{error}</p>

    <div className="error-actions">
      {lastTopic && (
        <button
          type="button"
          onClick={() =>
            handleGenerate(lastTopic)
          }
          disabled={loading}
        >
          {loading ? "Retrying..." : "Try again"}
        </button>
      )}

      <button
        type="button"
        className="error-dismiss"
        onClick={clearError}
        disabled={loading}
      >
        Dismiss
      </button>
    </div>
  </div>
)}
      </>
    );
  }

  if (!studySet) {
    return null;
  }

  if (page === "flashcards") {
    return (
      <FlashcardDeck
        flashcards={studySet.flashcards}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "quiz") {
    return (
      <Quiz
        questions={studySet.quiz}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  return (
    <StudyDashboard
      studySet={studySet}
      onStartFlashcards={() =>
        setPage("flashcards")
      }
      onStartQuiz={() =>
        setPage("quiz")
      }
      onReset={reset}
    />
  );
}

export default App;
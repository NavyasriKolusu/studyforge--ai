import { useState } from "react";

import TopicInput from "./components/TopicInput";
import StudyDashboard from "./components/StudyDashboard";
import FlashcardDeck from "./components/FlashcardDeck";
import Quiz from "./components/Quiz";

import { mockStudySet } from "./data/mockStudySet";

import type { StudySet } from "./types/study";

type Page =
  | "home"
  | "dashboard"
  | "flashcards"
  | "quiz";

function App() {
  const [page, setPage] = useState<Page>("home");

  const [loading, setLoading] = useState(false);

  const [studySet, setStudySet] =
    useState<StudySet | null>(null);

  const handleGenerate = async (topic: string) => {
    setLoading(true);

    console.log("Generating:", topic);

    try {
      // Temporary delay.
      // Later this becomes the real AI API request.
      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      setStudySet(mockStudySet);
      setPage("dashboard");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStudySet(null);
    setPage("home");
  };

  if (page === "home") {
    return (
      <TopicInput
        loading={loading}
        onGenerate={handleGenerate}
      />
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
      onStartQuiz={() => setPage("quiz")}
      onReset={reset}
    />
  );
}

export default App;
import { BookOpen, Brain, RotateCcw } from "lucide-react";
import type { StudySet } from "../types/study";

interface StudyDashboardProps {
  studySet: StudySet;
  onStartFlashcards: () => void;
  onStartQuiz: () => void;
  onReset: () => void;
}

export default function StudyDashboard({
  studySet,
  onStartFlashcards,
  onStartQuiz,
  onReset,
}: StudyDashboardProps) {
  return (
    <div className="dashboard">
      <button className="back-button" onClick={onReset}>
        <RotateCcw size={16} />
        New study set
      </button>

      <div className="dashboard-header">
        <span className="eyebrow">
          YOUR STUDY SET
        </span>

        <h1>{studySet.title}</h1>

        <p>{studySet.summary}</p>
      </div>

      <div className="mode-grid">
        <button
          className="mode-card"
          onClick={onStartFlashcards}
        >
          <div className="mode-icon">
            <BookOpen />
          </div>

          <div>
            <h2>Flashcards</h2>

            <p>
              Review {studySet.flashcards.length} concepts
              at your own pace.
            </p>
          </div>

          <span>Start learning →</span>
        </button>

        <button
          className="mode-card"
          onClick={onStartQuiz}
        >
          <div className="mode-icon">
            <Brain />
          </div>

          <div>
            <h2>Quiz</h2>

            <p>
              Test yourself with {studySet.quiz.length} questions
              and instant explanations.
            </p>
          </div>

          <span>Start quiz →</span>
        </button>
      </div>
    </div>
  );
}
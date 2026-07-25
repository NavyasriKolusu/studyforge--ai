import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import type { QuizQuestion } from "../types/study";

interface QuizProps {
  questions: QuizQuestion[];
  onBack: () => void;
}

export default function Quiz({
  questions,
  onBack,
}: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [score, setScore] = useState(0);

  const [wrongQuestions, setWrongQuestions] = useState<
    QuizQuestion[]
  >([]);

  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const selectAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);

    if (answerIndex === currentQuestion.correctAnswer) {
      setScore((currentScore) => currentScore + 1);
    } else {
      setWrongQuestions((current) => [
        ...current,
        currentQuestion,
      ]);
    }
  };

  const nextQuestion = () => {
    if (currentIndex === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedAnswer(null);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setWrongQuestions([]);
    setFinished(false);
  };

  if (finished) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    return (
      <div className="study-page">
        <div className="results-card">
          <span className="eyebrow">QUIZ COMPLETE</span>

          <h1>{percentage}%</h1>

          <h2>
            {score} / {questions.length} correct
          </h2>

          <p>
            {percentage >= 80
              ? "Excellent work. You have a strong understanding of this topic."
              : percentage >= 60
              ? "Good progress. Review the concepts you missed and try again."
              : "A little more review will help. Go through the flashcards and retry the quiz."}
          </p>

          {wrongQuestions.length > 0 && (
            <div className="wrong-summary">
              <h3>Concepts to review</h3>

              {wrongQuestions.map((question) => (
                <div
                  key={question.id}
                  className="review-item"
                >
                  <strong>{question.question}</strong>

                  <p>{question.explanation}</p>
                </div>
              ))}
            </div>
          )}

          <div className="result-actions">
            <button
              className="secondary-button"
              onClick={onBack}
            >
              Study set
            </button>

            <button
              className="primary-button"
              onClick={restartQuiz}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect =
    selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="study-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={17} />
        Study set
      </button>

      <div className="quiz-header">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>

        <span>Score: {score}</span>
      </div>

      <div className="progress-bar">
        <div
          style={{
            width: `${
              ((currentIndex + 1) / questions.length) * 100
            }%`,
          }}
        />
      </div>

      <div className="question-card">
        <h1>{currentQuestion.question}</h1>

        <div className="answers">
          {currentQuestion.options.map(
            (option, index) => {
              let className = "answer-button";

              if (selectedAnswer !== null) {
                if (
                  index === currentQuestion.correctAnswer
                ) {
                  className += " correct";
                } else if (index === selectedAnswer) {
                  className += " incorrect";
                }
              }

              return (
                <button
                  key={`${currentQuestion.id}-${index}`}
                  className={className}
                  disabled={selectedAnswer !== null}
                  onClick={() => selectAnswer(index)}
                >
                  <span>
                    {String.fromCharCode(65 + index)}
                  </span>

                  {option}
                </button>
              );
            }
          )}
        </div>

        {selectedAnswer !== null && (
          <div
            className={`feedback ${
              isCorrect ? "success" : "error"
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 />
            ) : (
              <XCircle />
            )}

            <div>
              <strong>
                {isCorrect
                  ? "Correct!"
                  : "Not quite."}
              </strong>

              <p>{currentQuestion.explanation}</p>
            </div>
          </div>
        )}

        {selectedAnswer !== null && (
          <button
            className="primary-button next-question"
            onClick={nextQuestion}
          >
            {currentIndex === questions.length - 1
              ? "See results"
              : "Next question"}
          </button>
        )}
      </div>
    </div>
  );
}
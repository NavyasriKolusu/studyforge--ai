import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";

import type { QuizQuestion } from "../types/study";

interface QuizProps {
  questions: QuizQuestion[];
  onBack: () => void;
}

interface AnswerRecord {
  question: QuizQuestion;
  selectedAnswer: number;
  isCorrect: boolean;
}

export default function Quiz({
  questions,
  onBack,
}: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [answers, setAnswers] = useState<AnswerRecord[]>(
    []
  );

  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  /*
   * Protect the component from an empty quiz.
   */
  if (!currentQuestion) {
    return (
      <div className="study-page">
        <div className="results-card">
          <span className="eyebrow">QUIZ UNAVAILABLE</span>

          <h2>No quiz questions are available.</h2>

          <p>
            Generate a new study set and try again.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={onBack}
          >
            Back to study set
          </button>
        </div>
      </div>
    );
  }

  /*
   * Calculate the score from recorded answers instead
   * of maintaining a separate score state.
   *
   * This avoids two sources of truth.
   */
  const score = answers.filter(
    (answer) => answer.isCorrect
  ).length;

  const progress =
    ((currentIndex + 1) / questions.length) * 100;

  const selectAnswer = (answerIndex: number) => {
    /*
     * Prevent changing an answer after it has
     * already been submitted.
     */
    if (selectedAnswer !== null) {
      return;
    }

    const isCorrect =
      answerIndex === currentQuestion.correctAnswer;

    setSelectedAnswer(answerIndex);

    setAnswers((currentAnswers) => [
      ...currentAnswers,
      {
        question: currentQuestion,
        selectedAnswer: answerIndex,
        isCorrect,
      },
    ]);
  };

  const nextQuestion = () => {
    if (selectedAnswer === null) {
      return;
    }

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
    setAnswers([]);
    setFinished(false);
  };

  /*
   * RESULTS PAGE
   */
  if (finished) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    const correctAnswers = answers.filter(
      (answer) => answer.isCorrect
    );

    const wrongAnswers = answers.filter(
      (answer) => !answer.isCorrect
    );

    let performanceTitle = "Keep learning";
    let performanceMessage =
      "Review the concepts below and use the flashcards before trying again.";

    if (percentage === 100) {
      performanceTitle = "Perfect score!";
      performanceMessage =
        "Excellent work. You answered every question correctly.";
    } else if (percentage >= 80) {
      performanceTitle = "Excellent work!";
      performanceMessage =
        "You have a strong understanding of this topic. Review the few concepts you missed.";
    } else if (percentage >= 60) {
      performanceTitle = "Good progress!";
      performanceMessage =
        "You understand many of the key concepts. A focused review should help strengthen the remaining areas.";
    }

    return (
      <div className="study-page">
        <div className="results-card">
          <div
            className="result-icon"
            aria-hidden="true"
          >
            <Trophy size={28} />
          </div>

          <span className="eyebrow">
            QUIZ COMPLETE
          </span>

          <h1>{percentage}%</h1>

          <h2>{performanceTitle}</h2>

          <p>{performanceMessage}</p>

          {/* SCORE SUMMARY */}

          <div className="score-summary">
            <div className="score-stat">
              <strong>{score}</strong>
              <span>Correct</span>
            </div>

            <div className="score-stat">
              <strong>
                {questions.length - score}
              </strong>
              <span>Incorrect</span>
            </div>

            <div className="score-stat">
              <strong>{questions.length}</strong>
              <span>Total</span>
            </div>
          </div>

          {/* STRENGTHS */}

          {correctAnswers.length > 0 && (
            <div className="analytics-section">
              <div className="analytics-heading">
                <CheckCircle2 size={20} />

                <div>
                  <h3>Your strengths</h3>

                  <p>
                    Concepts you answered correctly.
                  </p>
                </div>
              </div>

              <div className="analytics-list">
                {correctAnswers.map(
                  ({ question }) => (
                    <div
                      key={`correct-${question.id}`}
                      className="analytics-item strength-item"
                    >
                      <CheckCircle2
                        size={17}
                        aria-hidden="true"
                      />

                      <span>
                        {question.question}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* CONCEPTS TO REVIEW */}

          {wrongAnswers.length > 0 && (
            <div className="analytics-section review-section">
              <div className="analytics-heading">
                <Target size={20} />

                <div>
                  <h3>Focus areas</h3>

                  <p>
                    Review these concepts before your
                    next attempt.
                  </p>
                </div>
              </div>

              <div className="wrong-summary">
                {wrongAnswers.map(
                  ({
                    question,
                    selectedAnswer,
                  }) => (
                    <div
                      key={`wrong-${question.id}`}
                      className="review-item"
                    >
                      <strong>
                        {question.question}
                      </strong>

                      <div className="review-answer">
                        <span>Your answer</span>

                        <p>
                          {
                            question.options[
                              selectedAnswer
                            ]
                          }
                        </p>
                      </div>

                      <div className="review-answer correct-review">
                        <span>Correct answer</span>

                        <p>
                          {
                            question.options[
                              question.correctAnswer
                            ]
                          }
                        </p>
                      </div>

                      <p className="review-explanation">
                        {question.explanation}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* ACTIONS */}

          <div className="result-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onBack}
            >
              <ArrowLeft size={17} />
              Study set
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={restartQuiz}
            >
              <RotateCcw size={17} />
              Retake quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect =
    selectedAnswer ===
    currentQuestion.correctAnswer;

  return (
    <div className="study-page">
      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        Study set
      </button>

      {/* QUIZ PROGRESS */}

      <div className="quiz-progress-section">
        <div className="quiz-progress-label">
          <span>
            Question {currentIndex + 1} of{" "}
            {questions.length}
          </span>

          <span>
            {Math.round(progress)}%
          </span>
        </div>

        <div
          className="quiz-progress-track"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
        >
          <div
            className="quiz-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="quiz-header">
        <span>
          Question {currentIndex + 1}
        </span>

        <span>
          Score: {score}/{answers.length}
        </span>
      </div>

      {/* QUESTION */}

      <div className="question-card">
        <h1>{currentQuestion.question}</h1>

        <div
          className="answers"
          role="group"
          aria-label="Answer options"
        >
          {currentQuestion.options.map(
            (option, index) => {
              let className = "answer-button";

              if (selectedAnswer !== null) {
                if (
                  index ===
                  currentQuestion.correctAnswer
                ) {
                  className += " correct";
                } else if (
                  index === selectedAnswer
                ) {
                  className += " incorrect";
                }
              }

              return (
                <button
                  type="button"
                  key={`${currentQuestion.id}-${index}`}
                  className={className}
                  disabled={selectedAnswer !== null}
                  onClick={() =>
                    selectAnswer(index)
                  }
                  aria-pressed={
                    selectedAnswer === index
                  }
                >
                  <span aria-hidden="true">
                    {String.fromCharCode(
                      65 + index
                    )}
                  </span>

                  {option}
                </button>
              );
            }
          )}
        </div>

        {/* ANSWER FEEDBACK */}

        {selectedAnswer !== null && (
          <div
            className={`feedback ${
              isCorrect ? "success" : "error"
            }`}
            role="status"
            aria-live="polite"
          >
            {isCorrect ? (
              <CheckCircle2
                aria-hidden="true"
              />
            ) : (
              <XCircle aria-hidden="true" />
            )}

            <div>
              <strong>
                {isCorrect
                  ? "Correct!"
                  : "Not quite."}
              </strong>

              {!isCorrect && (
                <p className="correct-answer-text">
                  Correct answer:{" "}
                  <strong>
                    {
                      currentQuestion.options[
                        currentQuestion.correctAnswer
                      ]
                    }
                  </strong>
                </p>
              )}

              <p>
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        )}

        {selectedAnswer !== null && (
          <button
            type="button"
            className="primary-button next-question"
            onClick={nextQuestion}
          >
            {currentIndex ===
            questions.length - 1
              ? "View results"
              : "Next question"}
          </button>
        )}
      </div>
    </div>
  );
}
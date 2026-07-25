import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

import type { Flashcard } from "../types/study";

interface FlashcardDeckProps {
  flashcards: Flashcard[];
  onBack: () => void;
}

export default function FlashcardDeck({
  flashcards,
  onBack,
}: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [flipped, setFlipped] =
    useState(false);

  const currentCard = flashcards[currentIndex];

  /*
   * Protect the component if an empty flashcard
   * array somehow reaches the frontend.
   */
  if (!currentCard) {
    return (
      <div className="study-page">
        <div className="results-card">
          <span className="eyebrow">
            FLASHCARDS UNAVAILABLE
          </span>

          <h2>
            No flashcards are available.
          </h2>

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

  const progress =
    ((currentIndex + 1) / flashcards.length) *
    100;

  const toggleCard = () => {
    setFlipped((value) => !value);
  };

  const goNext = () => {
    if (
      currentIndex <
      flashcards.length - 1
    ) {
      setCurrentIndex(
        (current) => current + 1
      );

      setFlipped(false);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(
        (current) => current - 1
      );

      setFlipped(false);
    }
  };

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

      <div className="study-heading">
        <span>
          Card {currentIndex + 1} of{" "}
          {flashcards.length}
        </span>

        <h1>Flashcards</h1>

        <p>
          Click the card to reveal the answer.
        </p>
      </div>

      {/* 3D FLASHCARD */}

      <button
        type="button"
        className={`flashcard-3d ${
          flipped ? "is-flipped" : ""
        }`}
        onClick={toggleCard}
        aria-label={
          flipped
            ? "Showing answer. Click to show the question."
            : "Showing question. Click to reveal the answer."
        }
        aria-pressed={flipped}
      >
        <div className="flashcard-inner">
          {/* FRONT */}

          <div className="flashcard-face flashcard-front">
            <span className="card-label">
              QUESTION
            </span>

            <h2>
              {currentCard.question}
            </h2>

            <div className="flip-hint">
              <RotateCcw
                size={15}
                aria-hidden="true"
              />

              Click to reveal answer
            </div>
          </div>

          {/* BACK */}

          <div className="flashcard-face flashcard-back">
            <span className="card-label">
              ANSWER
            </span>

            <h2>
              {currentCard.answer}
            </h2>

            <div className="flip-hint">
              <RotateCcw
                size={15}
                aria-hidden="true"
              />

              Click to see question
            </div>
          </div>
        </div>
      </button>

      {/* PROGRESS */}

      <div className="flashcard-progress-info">
        <span>
          {Math.round(progress)}% complete
        </span>

        <span>
          {currentIndex + 1} /{" "}
          {flashcards.length}
        </span>
      </div>

      <div
        className="progress-bar"
        role="progressbar"
        aria-label="Flashcard progress"
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={flashcards.length}
      >
        <div
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* NAVIGATION */}

      <div className="navigation-buttons">
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentIndex === 0}
        >
          <ArrowLeft
            size={17}
            aria-hidden="true"
          />

          Previous
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={
            currentIndex ===
            flashcards.length - 1
          }
        >
          Next

          <ArrowRight
            size={17}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
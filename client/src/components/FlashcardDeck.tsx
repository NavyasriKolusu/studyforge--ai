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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const currentCard = flashcards[currentIndex];

  const goNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((current) => current + 1);
      setFlipped(false);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((current) => current - 1);
      setFlipped(false);
    }
  };

  return (
    <div className="study-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={17} />
        Study set
      </button>

      <div className="study-heading">
        <span>
          Card {currentIndex + 1} of {flashcards.length}
        </span>

        <h1>Flashcards</h1>

        <p>Click the card to reveal the answer.</p>
      </div>

      <div
        className={`flashcard ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped((value) => !value)}
      >
        <span className="card-label">
          {flipped ? "ANSWER" : "QUESTION"}
        </span>

        <h2>
          {flipped
            ? currentCard.answer
            : currentCard.question}
        </h2>

        <div className="flip-hint">
          <RotateCcw size={15} />
          Click to flip
        </div>
      </div>

      <div className="progress-bar">
        <div
          style={{
            width: `${
              ((currentIndex + 1) / flashcards.length) * 100
            }%`,
          }}
        />
      </div>

      <div className="navigation-buttons">
        <button
          onClick={goPrevious}
          disabled={currentIndex === 0}
        >
          <ArrowLeft size={17} />
          Previous
        </button>

        <button
          onClick={goNext}
          disabled={currentIndex === flashcards.length - 1}
        >
          Next
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
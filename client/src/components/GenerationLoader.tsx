import { useEffect, useState } from "react";

const steps = [
  "Reading your topic",
  "Understanding key concepts",
  "Generating flashcards",
  "Creating quiz questions",
  "Finalizing your study set",
];

function GenerationLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) =>
        Math.min(current + 1, steps.length - 1)
      );
    }, 1400);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="generation-overlay"
      role="status"
      aria-live="polite"
      aria-label="Generating study set"
    >
      <div className="generation-card">
        <div
          className="generation-brain"
          aria-hidden="true"
        >
          🧠
        </div>

        <h2>Building your study set...</h2>

        <p>
          StudyForge is transforming your topic into
          flashcards and an interactive quiz.
        </p>

        <div className="generation-steps">
          {steps.map((step, index) => {
            const completed = index < activeStep;
            const active = index === activeStep;

            return (
              <div
                key={step}
                className={`generation-step ${
                  index <= activeStep ? "active" : ""
                }`}
              >
                <span aria-hidden="true">
                  {completed
                    ? "✓"
                    : active
                      ? "●"
                      : "○"}
                </span>

                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GenerationLoader;
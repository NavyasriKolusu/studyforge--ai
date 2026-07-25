import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";

interface TopicInputProps {
  loading: boolean;
  onGenerate: (topic: string) => void;
}

const suggestions = [
  "DBMS Normalization",
  "Java OOP",
  "Operating Systems",
  "Computer Networks",
];

export default function TopicInput({
  loading,
  onGenerate,
}: TopicInputProps) {
  const [topic, setTopic] = useState("");

  const handleSubmit = () => {
    const cleanedTopic = topic.trim();

    if (!cleanedTopic || loading) {
      return;
    }

    onGenerate(cleanedTopic);
  };

  return (
    <div className="landing-container">
      <div className="hero-icon">
        <BookOpen size={30} />
      </div>

      <h1 className="hero-title">
        Study<span>Forge</span>
      </h1>

      <p className="hero-subtitle">
        Turn any topic or your own notes into interactive
        flashcards and quizzes powered by AI.
      </p>

      <div className="input-card">
        <label htmlFor="study-topic">
          What would you like to study?
        </label>

        <textarea
          id="study-topic"
          value={topic}
          disabled={loading}
          maxLength={5000}
          placeholder="Paste your notes or enter a topic...

Example: Explain DBMS normalization, functional dependencies and normal forms for an interview."
          onChange={(event) => setTopic(event.target.value)}
        />

        <div className="input-footer">
          <span className="character-count">
            {topic.length}/5000
          </span>

          <button
            className="primary-button"
            disabled={!topic.trim() || loading}
            onClick={handleSubmit}
          >
            <Sparkles size={18} />

            {loading
              ? "Creating your study set..."
              : "Generate Study Set"}
          </button>
        </div>
      </div>

      <div className="suggestions">
        <p>Need inspiration?</p>

        <div className="suggestion-list">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              disabled={loading}
              onClick={() => setTopic(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
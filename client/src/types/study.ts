export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StudySet {
  title: string;
  summary: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}
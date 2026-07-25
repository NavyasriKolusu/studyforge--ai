import type { StudySet } from "../types/study";

export const mockStudySet: StudySet = {
  title: "Database Management Systems",

  summary:
    "Master important DBMS concepts through interactive flashcards and a short quiz.",

  flashcards: [
    {
      id: "flash-1",
      question: "What does ACID stand for?",
      answer:
        "Atomicity, Consistency, Isolation, and Durability.",
    },
    {
      id: "flash-2",
      question: "What is normalization?",
      answer:
        "Normalization is the process of organizing database tables to reduce redundancy and improve data integrity.",
    },
    {
      id: "flash-3",
      question: "What is a primary key?",
      answer:
        "A primary key is an attribute or set of attributes that uniquely identifies each row in a table.",
    },
    {
      id: "flash-4",
      question: "What is a foreign key?",
      answer:
        "A foreign key is an attribute that references the primary key of another table.",
    },
  ],

  quiz: [
    {
      id: "quiz-1",
      question: "Which normal form removes partial dependency?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctAnswer: 1,
      explanation:
        "Second Normal Form removes partial dependencies on a composite primary key.",
    },
    {
      id: "quiz-2",
      question:
        "Which ACID property ensures committed data survives a system failure?",
      options: [
        "Atomicity",
        "Consistency",
        "Isolation",
        "Durability",
      ],
      correctAnswer: 3,
      explanation:
        "Durability guarantees that committed transactions remain permanently stored.",
    },
    {
      id: "quiz-3",
      question: "Which key uniquely identifies a database row?",
      options: [
        "Foreign key",
        "Candidate table",
        "Primary key",
        "Index",
      ],
      correctAnswer: 2,
      explanation:
        "A primary key uniquely identifies every row in a table.",
    },
  ],
};
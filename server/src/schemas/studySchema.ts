import { z } from "zod";

const flashcardSchema = z.object({
  id: z.string().min(1),

  question: z
    .string()
    .trim()
    .min(5)
    .max(500),

  answer: z
    .string()
    .trim()
    .min(2)
    .max(2000),
});
const quizQuestionSchema = z.object({
  id: z.string().min(1),

  question: z
    .string()
    .trim()
    .min(5)
    .max(500),

  options: z
    .array(
      z.string().trim().min(1).max(500)
    )
    .length(4),

  correctAnswer: z
    .number()
    .int()
    .min(0)
    .max(3),

  explanation: z
    .string()
    .trim()
    .min(10)
    .max(2000),
});
export const studySetSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3)
    .max(150),

  summary: z
    .string()
    .trim()
    .min(10)
    .max(1000),

  flashcards: z
    .array(flashcardSchema)
    .min(5)
    .max(20),

  quiz: z
    .array(quizQuestionSchema)
    .min(5)
    .max(20),
});

export type StudySet = z.infer<typeof studySetSchema>;
type StudySetData = z.infer<typeof studySetSchema>;

export function validateStudySetQuality(
  studySet: StudySetData
): string[] {
  const problems: string[] = [];

  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  // -----------------------------------------
  // Duplicate flashcard questions
  // -----------------------------------------

  const flashcardQuestions =
    studySet.flashcards.map((card) =>
      normalize(card.question)
    );

  if (
    new Set(flashcardQuestions).size !==
    flashcardQuestions.length
  ) {
    problems.push(
      "Duplicate flashcard questions detected."
    );
  }

  // -----------------------------------------
  // Duplicate quiz questions
  // -----------------------------------------

  const quizQuestions =
    studySet.quiz.map((question) =>
      normalize(question.question)
    );

  if (
    new Set(quizQuestions).size !==
    quizQuestions.length
  ) {
    problems.push(
      "Duplicate quiz questions detected."
    );
  }

  // -----------------------------------------
  // Duplicate IDs
  // -----------------------------------------

  const ids = [
    ...studySet.flashcards.map((card) => card.id),
    ...studySet.quiz.map((question) => question.id),
  ];

  if (new Set(ids).size !== ids.length) {
    problems.push("Duplicate content IDs detected.");
  }

  // -----------------------------------------
  // Quiz-specific checks
  // -----------------------------------------

  for (const question of studySet.quiz) {
    const normalizedOptions =
      question.options.map(normalize);

    if (
      new Set(normalizedOptions).size !==
      normalizedOptions.length
    ) {
      problems.push(
        `Duplicate options detected in quiz question: "${question.question}"`
      );
    }

    const correctOption =
      question.options[question.correctAnswer];

    if (!correctOption?.trim()) {
      problems.push(
        `Missing correct answer for quiz question: "${question.question}"`
      );
    }
  }

  return problems;
}
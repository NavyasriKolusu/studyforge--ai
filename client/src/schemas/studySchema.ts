import { z } from "zod";

const flashcardSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

const quizQuestionSchema = z
  .object({
    id: z.string().min(1),
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2).max(6),
    correctAnswer: z.number().int().nonnegative(),
    explanation: z.string().min(1),
  })
  .refine(
    (question) => question.correctAnswer < question.options.length,
    {
      message: "Correct answer index is outside the options array",
      path: ["correctAnswer"],
    }
  );

export const studySetSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),

  flashcards: z
    .array(flashcardSchema)
    .min(1)
    .max(20),

  quiz: z
    .array(quizQuestionSchema)
    .min(1)
    .max(20),
});
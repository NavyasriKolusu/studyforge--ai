import { Router } from "express";
import { z } from "zod";

import { generateStudySet } from "../services/gemini.js";

import {
  studySetSchema,
  validateStudySetQuality,
} from "../schemas/studySchema.js";

const router = Router();

/*
 * Validate the user's input before sending anything
 * to Gemini.
 */
const generateRequestSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(
      3,
      "Please enter a little more information."
    )
    .max(
      5000,
      "Input must be 5000 characters or fewer."
    ),
});

/*
 * POST /api/generate
 *
 * Flow:
 *
 * User input
 *    ↓
 * Input validation
 *    ↓
 * Gemini
 *    ↓
 * Zod structural validation
 *    ↓
 * Content-quality validation
 *    ↓
 * Frontend
 */
router.post("/", async (request, response) => {
  /*
   * STEP 1:
   * Validate incoming user input.
   */
  const inputResult =
    generateRequestSchema.safeParse(request.body);

  if (!inputResult.success) {
    return response.status(400).json({
      error: "INVALID_INPUT",

      message:
        inputResult.error.issues[0]?.message ??
        "Invalid study topic.",
    });
  }

  try {
    /*
     * STEP 2:
     * Ask Gemini to generate the study set.
     */
    const aiOutput = await generateStudySet(
      inputResult.data.topic
    );

    /*
     * STEP 3:
     * Validate the structure returned by Gemini.
     *
     * This checks things such as:
     * - title
     * - summary
     * - flashcards
     * - quiz
     * - answer options
     * - correctAnswer
     * - explanations
     */
    const validationResult =
      studySetSchema.safeParse(aiOutput);

    if (!validationResult.success) {
      console.error(
        "AI structural validation failed:",
        validationResult.error.issues
      );

      return response.status(502).json({
        error: "INVALID_AI_RESPONSE",

        message:
          "The AI generated an invalid study set. Please try again.",
      });
    }

    /*
     * STEP 4:
     * Run additional content-quality checks.
     *
     * Zod verifies the shape of the response.
     * These checks verify that the content itself
     * is usable.
     */
    const qualityProblems =
      validateStudySetQuality(
        validationResult.data
      );

    if (qualityProblems.length > 0) {
      console.error(
        "AI content quality validation failed:",
        qualityProblems
      );

      return response.status(502).json({
        error: "LOW_QUALITY_AI_RESPONSE",

        message:
          "The generated study set did not meet our quality checks. Please try again.",
      });
    }

    /*
     * STEP 5:
     * Only validated, quality-checked data reaches
     * the frontend.
     */
    return response.status(200).json({
      data: validationResult.data,
    });
  } catch (error) {
    /*
     * STEP 6:
     * Handle Gemini/API/parsing failures.
     */
    console.error(
      "Study set generation failed:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to generate the study set.";

    return response.status(502).json({
      error: "GENERATION_FAILED",
      message,
    });
  }
});

export default router;
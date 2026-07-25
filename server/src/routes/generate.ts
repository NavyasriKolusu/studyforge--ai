import { Router } from "express";
import { z } from "zod";

import { generateStudySet } from "../services/gemini.js";
import { studySetSchema } from "../schemas/studySchema.js";

const router = Router();

const generateRequestSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(3, "Please enter a little more information.")
    .max(5000, "Input must be 5000 characters or fewer."),
});

router.post("/", async (request, response) => {
  const inputResult = generateRequestSchema.safeParse(
    request.body
  );

  if (!inputResult.success) {
    return response.status(400).json({
      error: "INVALID_INPUT",
      message:
        inputResult.error.issues[0]?.message ??
        "Invalid study topic.",
    });
  }

  try {
    const aiOutput = await generateStudySet(
      inputResult.data.topic
    );

    const validationResult =
      studySetSchema.safeParse(aiOutput);

    if (!validationResult.success) {
      console.error(
        "Invalid AI response:",
        validationResult.error.issues
      );

      return response.status(502).json({
        error: "INVALID_AI_RESPONSE",
        message:
          "The AI generated an invalid study set. Please try again.",
      });
    }

    return response.status(200).json({
      data: validationResult.data,
    });
  } catch (error) {
    console.error("Generation failed:", error);

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
import OpenAI from "openai";
import { NextResponse } from "next/server";

import {
  calculateFromExtractedVariables,
  formatExtractedVariables,
  getCalculatorRegistryEntry,
  getMissingVariables,
  validateExtractedVariables,
} from "@/src/lib/clinical-assistant/calculatorRegistry";

import { clinicalExtractionJsonSchema } from "@/src/lib/clinical-assistant/extractionSchema";

import {
  buildClinicalAssistantUserPrompt,
  clinicalAssistantSystemPrompt,
} from "@/src/lib/clinical-assistant/prompts";

import type {
  ClinicalExtraction,
  ClinicalVariableValue,
} from "@/src/lib/clinical-assistant/types";

import type { ClinicalCalculatorId } from "@/src/lib/clinical-assistant/calculators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MINIMUM_CLINICAL_TEXT_LENGTH = 10;
const MAXIMUM_CLINICAL_TEXT_LENGTH = 20_000;

const SUPPORTED_CALCULATOR_IDS = new Set<ClinicalCalculatorId>([
  "cha2ds2-va",
  "has-bled",
  "painesd",
  "hcm-risk-scd",
  "hcm-risk-kids",
  "brugada-risk",
  "shanghai-brugada",
  "lqts-schwartz",
  "qtc",
]);

type RequestBody = {
  clinicalText?: unknown;
};



function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isSupportedCalculatorId(
  value: unknown,
): value is ClinicalCalculatorId {
  return (
    typeof value === "string" &&
    SUPPORTED_CALCULATOR_IDS.has(
      value as ClinicalCalculatorId,
    )
  );
}

function isConfidence(
  value: unknown,
): value is "high" | "moderate" | "low" {
  return (
    value === "high" ||
    value === "moderate" ||
    value === "low"
  );
}

function validateExtractionStructure(
  value: unknown,
): value is ClinicalExtraction {
  if (!isRecord(value)) {
    return false;
  }

  if (
    value.calculatorId !== null &&
    !isSupportedCalculatorId(value.calculatorId)
  ) {
    return false;
  }

  if (typeof value.detectedCondition !== "string") {
    return false;
  }

  if (!isConfidence(value.confidence)) {
    return false;
  }

  if (typeof value.rationale !== "string") {
    return false;
  }

  if (
    !Array.isArray(value.extractionNotes) ||
    !value.extractionNotes.every(
      (note) => typeof note === "string",
    )
  ) {
    return false;
  }

  if (!isRecord(value.variables)) {
    return false;
  }

  return true;
}

function parseStructuredExtraction(
  outputText: string,
): ClinicalExtraction {
  let parsed: unknown;

  try {
    parsed = JSON.parse(outputText);
  } catch {
    throw new Error(
      "The AI response could not be parsed as JSON.",
    );
  }

  if (!isRecord(parsed)) {
    throw new Error(
      "The AI response has an invalid root structure.",
    );
  }

  const extraction = parsed.extraction;

  if (!validateExtractionStructure(extraction)) {
    throw new Error(
      "The AI extraction does not match the expected structure.",
    );
  }

  return extraction;
}

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is missing from .env.local.",
    );
  }

  const normalizedKey = apiKey.toLocaleLowerCase(
    "en-US",
  );

  if (
    normalizedKey.includes("buraya") ||
    normalizedKey.includes("your_api_key") ||
    normalizedKey.includes("api_key_yaz") ||
    normalizedKey.includes("xxxxxxxx")
  ) {
    throw new Error(
      "OPENAI_API_KEY still contains a placeholder value.",
    );
  }

  return new OpenAI({
    apiKey,
  });
}

function getModelName(): string {
  const configuredModel =
    process.env.OPENAI_MODEL?.trim();

  return configuredModel || "gpt-5";
}

function getVariablesRecord(
  extraction: ClinicalExtraction,
): Record<string, ClinicalVariableValue> {
  return extraction.variables as Record<
    string,
    ClinicalVariableValue
  >;
}

function getPublicErrorMessage(
  error: unknown,
): string {
  if (error instanceof OpenAI.AuthenticationError) {
    return (
      "OpenAI authentication failed. Check the " +
      "OPENAI_API_KEY value in .env.local and restart the server."
    );
  }

  if (error instanceof OpenAI.RateLimitError) {
    return (
      "The OpenAI request limit has been reached. " +
      "Please try again shortly."
    );
  }

  if (error instanceof OpenAI.APIConnectionError) {
    return (
      "The server could not connect to OpenAI. " +
      "Check the internet connection and try again."
    );
  }

  if (error instanceof OpenAI.BadRequestError) {
    return (
      "OpenAI rejected the clinical extraction request. " +
      "Check the configured model and structured-output schema."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected clinical assistant error occurred.";
}

export async function POST(
  request: Request,
) {
  try {
    let requestBody: RequestBody;

    try {
      requestBody =
        (await request.json()) as RequestBody;
    } catch {
      return NextResponse.json(
        {
          status: "invalid-data",
          message:
            "The request body must contain valid JSON.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof requestBody.clinicalText !== "string"
    ) {
      return NextResponse.json(
        {
          status: "invalid-data",
          message:
            "clinicalText must be provided as text.",
        },
        {
          status: 400,
        },
      );
    }

    const clinicalText =
      requestBody.clinicalText.trim();

    if (
      clinicalText.length <
      MINIMUM_CLINICAL_TEXT_LENGTH
    ) {
      return NextResponse.json(
        {
          status: "invalid-data",
          message:
            "Please enter a more complete clinical description.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      clinicalText.length >
      MAXIMUM_CLINICAL_TEXT_LENGTH
    ) {
      return NextResponse.json(
        {
          status: "invalid-data",
          message:
            `Clinical text must not exceed ${MAXIMUM_CLINICAL_TEXT_LENGTH.toLocaleString("en-US")} characters.`,
        },
        {
          status: 400,
        },
      );
    }

    const openai = getOpenAIClient();
    const model = getModelName();

    const response =
      await openai.responses.create({
        model,

        store: false,

        instructions:
          clinicalAssistantSystemPrompt,

        input:
          buildClinicalAssistantUserPrompt(
            clinicalText,
          ),

        text: {
          format: {
            type: "json_schema",
            name:
              clinicalExtractionJsonSchema.name,
            strict:
              clinicalExtractionJsonSchema.strict,

            schema:
              clinicalExtractionJsonSchema.schema,
          },
        },
      });

    const outputText =
      response.output_text?.trim();

    if (!outputText) {
      throw new Error(
        "OpenAI returned an empty extraction response.",
      );
    }

    const extraction =
      parseStructuredExtraction(outputText);

    if (extraction.calculatorId === null) {
      return NextResponse.json(
        {
          status: "unsupported",
          detectedCondition:
            extraction.detectedCondition,
          calculatorId: null,
          calculatorName: null,
          confidence: extraction.confidence,
          rationale: extraction.rationale,
          extractionNotes:
            extraction.extractionNotes,
          message:
            "No supported EP-SCORE AI calculator could be selected for this clinical text.",
        },
        {
          status: 200,
        },
      );
    }

    const calculatorId =
      extraction.calculatorId;

    const calculator =
      getCalculatorRegistryEntry(
        calculatorId,
      );

    const variables =
      getVariablesRecord(extraction);

    const extractedVariables =
      formatExtractedVariables(
        calculatorId,
        variables,
      );

    const missingVariables =
      getMissingVariables(
        calculatorId,
        variables,
      );

    if (missingVariables.length > 0) {
      return NextResponse.json(
        {
          status: "missing-data",
          detectedCondition:
            extraction.detectedCondition,
          calculatorId,
          calculatorName: calculator.name,
          calculatorHref: calculator.href,
          confidence: extraction.confidence,
          rationale: extraction.rationale,
          extractedVariables,
          missingVariables,
          extractionNotes:
            extraction.extractionNotes,
          message:
            "The calculator was identified, but one or more required variables are missing. No score has been calculated.",
        },
        {
          status: 200,
        },
      );
    }

    const validationErrors =
      validateExtractedVariables(
        calculatorId,
        variables,
      );

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          status: "invalid-data",
          detectedCondition:
            extraction.detectedCondition,
          calculatorId,
          calculatorName: calculator.name,
          calculatorHref: calculator.href,
          confidence: extraction.confidence,
          rationale: extraction.rationale,
          extractedVariables,
          validationErrors,
          extractionNotes:
            extraction.extractionNotes,
          message:
            "One or more extracted variables are outside the accepted range or use an invalid value. No score has been calculated.",
        },
        {
          status: 200,
        },
      );
    }

    const result =
      calculateFromExtractedVariables(
        calculatorId,
        variables,
      );

    return NextResponse.json(
      {
        status: "complete",
        detectedCondition:
          extraction.detectedCondition,
        calculatorId,
        calculatorName: calculator.name,
        calculatorHref: calculator.href,
        confidence: extraction.confidence,
        rationale: extraction.rationale,
        extractedVariables,
        extractionNotes:
          extraction.extractionNotes,
        result,
        disclaimer:
          "EP-SCORE AI is a clinical decision-support tool. The result must be verified by a qualified clinician and must not replace independent clinical judgment, source-guideline review or shared decision-making.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Clinical Assistant API error:",
      error,
    );

    return NextResponse.json(
      {
        status: "error",
        message:
          getPublicErrorMessage(error),
      },
      {
        status: 500,
      },
    );
  }
}
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { InputValues, OutputValues } from "@google-labs/breadboard";
import { encode } from 'gpt-3-encoder';
import { OpenAI } from "openai";

export type GenerateEmbeddingOutputs = OutputValues & {
  embedding: {};
};

export type GenerateEmbeddingInputs = {
  /**
   * The model to use for text completion.
   */
  model: string;
  /**
   * Prompt for text completion.
   */
  input: string;
  /**
   * The OPEN AI Platform API key
   */
  OPENAI_API_KEY: string;
};

const embeddingModelContextSizes: Record<string, number> = {
  'text-embedding-ada-002': 8192
}


export default async (inputs: InputValues): Promise<GenerateEmbeddingOutputs> => {
  const values = inputs as GenerateEmbeddingInputs;

  const model = values.model || "text-davinci-003";

  if (model in embeddingModelContextSizes === false) throw new Error(`Model ${model} is not supported for embedding`);
  if (!values.OPENAI_API_KEY)
    throw new Error("Text completion requires `OPENAI_API_KEY` input");
  if (!values.input) throw new Error("Text completion requires `text` input");

  const inputTokenCount = encode(values.input).length;

  if (inputTokenCount >= embeddingModelContextSizes[model]) throw new Error(`Embedding input needs to shorter than the model's max token count of ${embeddingModelContextSizes[model]} tokens`);

  let output;

  try {

    const openai = new OpenAI({
      apiKey: values.OPENAI_API_KEY
    });

    const response = await openai.embeddings.create({
      model: model,
      input: values.input,
    });

    output = response.data;

  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    output = "error"
  }

  return { embedding: <any>output };
};
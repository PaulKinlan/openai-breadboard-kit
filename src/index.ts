/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  BreadboardNode,
  Kit,
  NodeFactory,
  NodeHandlers,
  OptionalIdConfiguration,
} from "@google-labs/breadboard";

import generateCompletion, { GenerateCompletionInputs, GenerateCompletionOutputs } from "./nodes/generate-completion.js";
import generateEmbedding, { GenerateEmbeddingInputs, GenerateEmbeddingOutputs } from "./nodes/generate-embedding.js";
import { config } from "process";

const coreHandlers = {
  generateCompletion,
  generateEmbedding
};

/**
 * Syntactic sugar around the `coreHandlers` library.
 */
export class OpenAI implements Kit {
  url = "npm:@paulkinlan/openai-breadboard-kit";
  #nodeFactory: NodeFactory;
  #handlers: NodeHandlers;

  get handlers() {
    return this.#handlers;
  }

  constructor(nodeFactory: NodeFactory) {
    this.#nodeFactory = nodeFactory;
    this.#handlers = coreHandlers;
  }

  generateCompletion<In = GenerateCompletionInputs, Out = GenerateCompletionOutputs>(
    config: OptionalIdConfiguration = {}
  ): BreadboardNode<In, Out>  {
    const { $id, ...rest } = config;
    return this.#nodeFactory.create(this, "generateCompletion", { ...rest }, $id);
  }

  generateEmbedding<In = GenerateEmbeddingInputs, Out = GenerateEmbeddingOutputs>(
    config: OptionalIdConfiguration = {}
  ): BreadboardNode<In, Out>  {
    const { $id, ...rest } = config;
    return this.#nodeFactory.create(this, "generateEmbedding", { ...rest }, $id);
  }
}

export type GenerateCompletionNodeType = ReturnType<OpenAI["generateCompletion"]>;
export type GenerateEmbeddingNodeType = ReturnType<OpenAI["generateEmbedding"]>;

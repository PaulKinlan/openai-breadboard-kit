import { Board } from "@google-labs/breadboard";
import { Starter } from "@google-labs/llm-starter";
import { OpenAI } from "@paulkinlan/openai-breadboard-kit";
import path from "path";
import test from 'ava';

test('completion', async (t) => {

  const board = await Board.load(
    path.join(process.cwd(), "graphs", "completion.json"), {
      kits: {
        "@paulkinlan/openai-breadboard-kit": OpenAI,
        "@google-labs/llm-starter": Starter,
      }
    }
  );

  const result = await board.runOnce({
    model: "text-davinci-003",
    text: "How much wood can a woodchuck chuck?",
  });

  t.regex(result.text as string, /^\n\n/);
})


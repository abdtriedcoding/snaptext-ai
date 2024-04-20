import { Redis } from "@upstash/redis";
import Anthropic from "@anthropic-ai/sdk";
import { Ratelimit } from "@upstash/ratelimit";
import { AnthropicStream, StreamingTextResponse } from "ai";
import { decodeBase64Image, isSupportedImageType } from "@/lib";

// Create an Anthropic API client (that's edge friendly)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter, that allows 5 requests per 5 seconds
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(2, "30 m"),
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  if (ratelimit) {
    const ip = req.headers.get("x-real-ip") ?? "local";
    const rl = await ratelimit.limit(ip);

    if (!rl.success) {
      return new Response("Rate limit exceeded", { status: 429 });
    }
  }

  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json();

  if (prompt.length > 6_464_471) {
    return new Response("Image too large, maximum file size is 4.5MB.", {
      status: 400,
    });
  }

  const { type, data } = decodeBase64Image(prompt);

  if (!type || !data)
    return new Response("Invalid image data", { status: 400 });

  if (!isSupportedImageType(type)) {
    return new Response(
      "Unsupported format. Only JPEG, PNG, GIF, and WEBP files are supported.",
      { status: 400 }
    );
  }

  // Ask Claude for a streaming chat completion given the prompt
  const response = await anthropic.messages.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Begin each of the following with a triangle symbol (▲ U+25B2): First, a brief description of the image to be used as alt text. Do not describe or extract text in the description. Second, the text extracted from the image, with newlines where applicable. Un-obstruct text if it is covered by something, to make it readable. If there is no text in the image, only respond with the description. Do not include any other information. Example: ▲ Lines of code in a text editor.▲ const x = 5; const y = 10; const z = x + y; console.log(z);",
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: type,
              data,
            },
          },
        ],
      },
      {
        role: "assistant",
        content: [
          {
            type: "text",
            text: "▲",
          },
        ],
      },
    ],
    model: "claude-3-haiku-20240307",
    stream: true,
    max_tokens: 300,
  });

  // Convert the response into a friendly text-stream
  const stream = AnthropicStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}

import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const systemPrompt = `You are a helpful learning assistant for a personalized learning path generator app. 
Your role is to:
- Help users choose the right learning topics and paths
- Provide guidance on learning strategies and best practices
- Answer questions about different subjects and skills
- Recommend resources and study techniques
- Motivate and encourage learners
- Suggest career paths and skill combinations

Be friendly, encouraging, and provide actionable advice. Keep responses concise but informative.`

  const prompt = convertToModelMessages([
    { id: "system", role: "system", parts: [{ type: "text", text: systemPrompt }] },
    ...messages,
  ])

  const result = streamText({
    model: "openai/gpt-4o-mini",
    prompt,
    abortSignal: req.signal,
    maxOutputTokens: 1000,
  })

  return result.toUIMessageStreamResponse({
    consumeSseStream: consumeStream,
  })
}

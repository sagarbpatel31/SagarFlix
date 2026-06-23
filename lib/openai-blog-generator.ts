import OpenAI from "openai";
import type { BlogGenerationRequest, BlogGenerationResult, BlogGeneratorProvider } from "@/lib/blog-generator";
import { getEnv } from "@/lib/env";

function createOpenAiClient() {
  return new OpenAI({
    apiKey: getEnv("OPENAI_API_KEY"),
  });
}

const SYSTEM_PROMPT = `You are an expert technical writer and career strategist. Your job is to generate high-quality blog drafts, LinkedIn posts, and X threads that showcase technical depth and career signal for a senior engineer specializing in:
- Embedded Linux & Systems Programming
- Robotics & Autonomy
- AI/ML Infrastructure
- Simulation & Digital Twins

Write in a way that recruiters, hiring managers, and senior engineers would find compelling. Be specific, avoid fluff, and include concrete technical details.`;

function buildUserPrompt(input: BlogGenerationRequest): string {
  const { topic, tone, format } = input;
  
  const toneGuidance = {
    Technical: "clear, implementation-focused, and specific with code-level details",
    Reflective: "thoughtful, personal, and grounded in lessons learned",
    Direct: "concise, decisive, and high-signal",
    Founder: "vision-oriented, pragmatic, and product-minded",
  }[tone];

  const formatGuidance = {
    Blog: `Write a full technical blog post (~1500-2500 words) with:
- Compelling title
- Executive summary (2-3 sentences)
- Structured sections with headings
- Code snippets or technical diagrams descriptions where relevant
- Concrete results/metrics
- Strong conclusion with call to action`,
    "LinkedIn Post": `Write a LinkedIn post (~800-1200 words) with:
- Hook in first 2 lines
- Professional but personal tone
- 3-4 key technical points
- Clear takeaway
- 3-5 relevant hashtags`,
    "X Thread": `Write an X/Twitter thread (10-15 tweets) with:
- Hook tweet with topic
- Numbered tweets (1/, 2/, etc.)
- One key insight per tweet
- Technical specificity
- Closing tweet with lesson/next step`,
  }[format];

  return `Generate a ${format.toLowerCase()} about: "${topic}"

Tone: ${tone} (${toneGuidance})

${formatGuidance}

Focus on the intersection of embedded systems, robotics, and AI. Make it sound like it's written by someone who has actually built these systems. Include specific technologies, frameworks, or architectural patterns where relevant.

Return ONLY valid JSON with this exact structure:
{
  "title": "string",
  "summary": "string (2-3 sentences max)",
  "fullContent": "string (the complete content)",
  "tags": ["string", ...],
  "socialPost": "string (condensed version for social sharing)"
}`;
}

export const openAiBlogGenerator: BlogGeneratorProvider = {
  async generate(input: BlogGenerationRequest): Promise<BlogGenerationResult> {
    const openai = createOpenAiClient();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(input) },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI returned empty response");
    }

    try {
      const parsed = JSON.parse(content) as BlogGenerationResult;
      
      if (!parsed.title || !parsed.fullContent) {
        throw new Error("Invalid response structure from OpenAI");
      }

      return parsed;
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", content);
      throw new Error("Failed to parse generated content");
    }
  },
};

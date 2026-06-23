import type { BlogFormat, BlogTone } from "@/data/blogs";

export type BlogGenerationRequest = {
  topic: string;
  tone: BlogTone;
  format: BlogFormat;
};

export type BlogGenerationResult = {
  title: string;
  summary: string;
  fullContent: string;
  tags: string[];
  socialPost: string;
};

export interface BlogGeneratorProvider {
  generate(input: BlogGenerationRequest): Promise<BlogGenerationResult>;
}

function normalizeTopic(topic: string) {
  return topic.trim().replace(/\s+/g, " ");
}

function titleCase(input: string) {
  return input
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildToneFrame(tone: BlogTone) {
  switch (tone) {
    case "Technical":
      return "clear, implementation-focused, and specific";
    case "Reflective":
      return "thoughtful, personal, and grounded in lessons learned";
    case "Direct":
      return "concise, decisive, and high-signal";
    case "Founder":
      return "vision-oriented, pragmatic, and product-minded";
  }
}

function buildOutline(topic: string, tone: BlogTone, format: BlogFormat) {
  const toneFrame = buildToneFrame(tone);

  if (format === "LinkedIn Post") {
    return [
      `Hook: ${topic} matters because it changes how I approach shipping technical work.`,
      `Context: write in a ${toneFrame} voice and keep the framing accessible.`,
      "Point 1: explain the challenge and why it is worth solving.",
      "Point 2: describe the system or workflow used to address it.",
      "Point 3: close with a practical takeaway or invite discussion.",
    ];
  }

  if (format === "X Thread") {
    return [
      `1/ ${topic}`,
      `2/ Write this in a ${toneFrame} voice.`,
      "3/ State the problem in one line.",
      "4/ Show the system, experiment, or decision that handled it.",
      "5/ End with the lesson and next step.",
    ];
  }

  return [
    "Introduction",
    "Context and problem statement",
    "Approach and implementation notes",
    "Results, tradeoffs, and lessons learned",
    "Conclusion and next steps",
  ];
}

function buildTags(topic: string, tone: BlogTone, format: BlogFormat) {
  const normalized = normalizeTopic(topic).toLowerCase();
  const tags = new Set<string>([tone, format]);

  if (normalized.includes("robot")) tags.add("Robotics");
  if (normalized.includes("embedded") || normalized.includes("linux") || normalized.includes("kernel")) {
    tags.add("Embedded");
  }
  if (normalized.includes("ai") || normalized.includes("llm") || normalized.includes("model")) {
    tags.add("AI/ML");
  }
  if (normalized.includes("career") || normalized.includes("job")) tags.add("Career");
  if (normalized.includes("simulation")) tags.add("Simulation");

  return [...tags];
}

function buildSummary(topic: string, tone: BlogTone, format: BlogFormat) {
  const frame = buildToneFrame(tone);
  const topicText = titleCase(normalizeTopic(topic));

  return `${topicText} framed as a ${format.toLowerCase()} in a ${frame} style, with a focus on actionable takeaways and a clear technical narrative.`;
}

function buildFullContent(topic: string, tone: BlogTone, format: BlogFormat) {
  const topicText = titleCase(normalizeTopic(topic));
  const outline = buildOutline(topic, tone, format);
  const toneFrame = buildToneFrame(tone);

  if (format === "X Thread") {
    return [
      `# ${topicText}`,
      "",
      `Writing this as a ${toneFrame} ${format.toLowerCase()} thread.`,
      "",
      ...outline.map((point) => `- ${point}`),
      "",
      "Closing thought: keep it specific enough that a recruiter or engineer can understand the value quickly.",
    ].join("\n");
  }

  if (format === "LinkedIn Post") {
    return [
      `# ${topicText}`,
      "",
      `This is a ${toneFrame} ${format.toLowerCase()} built around ${normalizeTopic(topic)}.`,
      "",
      ...outline.map((point) => `- ${point}`),
      "",
      "Final note: make the takeaway concrete, memorable, and easy to share.",
    ].join("\n");
  }

  return [
    `# ${topicText}`,
    "",
    `Tone: ${tone}`,
    `Format: ${format}`,
    "",
    `This draft uses a ${toneFrame} voice to explore ${normalizeTopic(topic)}.`,
    "",
    ...outline.map((heading) => `## ${heading}`),
    "",
    "Close with a concise takeaway, a technical reflection, or a call to action depending on the intended audience.",
  ].join("\n");
}

function buildSocialPost(topic: string, tone: BlogTone, format: BlogFormat) {
  const topicText = titleCase(normalizeTopic(topic));
  const frame = buildToneFrame(tone);

  if (format === "X Thread") {
    return `${topicText} in ${format.toLowerCase()}: a ${frame} breakdown of the problem, the system, and the lesson.`;
  }

  if (format === "LinkedIn Post") {
    return `${topicText} - a ${frame} ${format.toLowerCase()} with a clear technical takeaway and a strong career signal.`;
  }

  return `${topicText} - a ${frame} blog post that turns technical work into a clean, readable narrative.`;
}

function buildResponse(input: BlogGenerationRequest): BlogGenerationResult {
  const topic = normalizeTopic(input.topic || "Untitled topic");
  const title =
    input.format === "X Thread"
      ? titleCase(topic)
      : `${titleCase(topic)}: ${input.format === "Blog" ? "A Practical Guide" : "A Career Signal"}`;

  return {
    title,
    summary: buildSummary(topic, input.tone, input.format),
    fullContent: buildFullContent(topic, input.tone, input.format),
    tags: buildTags(topic, input.tone, input.format),
    socialPost: buildSocialPost(topic, input.tone, input.format),
  };
}

export const mockBlogGenerator: BlogGeneratorProvider = {
  async generate(input) {
    return buildResponse(input);
  },
};

export async function generateBlogDraft(
  input: BlogGenerationRequest,
  provider: BlogGeneratorProvider = mockBlogGenerator,
) {
  return provider.generate(input);
}

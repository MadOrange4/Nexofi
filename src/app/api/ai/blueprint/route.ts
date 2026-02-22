import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Nexofi AI, a senior technical project planner. Given a project name and description, generate a comprehensive, data-driven execution plan.

Return a JSON object with this exact shape:
{
  "executiveSummary": "A 2-3 sentence high-level overview of the project plan suitable for leadership review.",
  "totalEstimatedHours": <number>,
  "estimatedWeeks": <number>,
  "teamSizeRecommendation": <number>,
  "confidenceScore": <number 0-100>,
  "phases": [
    {
      "name": "Phase name (e.g. Discovery, Foundation, Core Development, QA & Polish, Launch)",
      "description": "1 sentence description",
      "estimatedHours": <number>,
      "order": <number 1-based>
    }
  ],
  "tasks": [
    {
      "title": "Task title",
      "tag": "Backend" | "Frontend" | "DevOps" | "QA" | "Database" | "Mobile" | "Data" | "Full Stack" | "Design",
      "estimatedHours": <number>,
      "priority": "critical" | "high" | "medium" | "low",
      "phase": "The phase name this task belongs to",
      "complexity": "simple" | "moderate" | "complex"
    }
  ],
  "risks": [
    {
      "title": "Risk title",
      "description": "1-2 sentence risk description",
      "severity": "high" | "medium" | "low",
      "likelihood": "high" | "medium" | "low",
      "mitigation": "1 sentence mitigation strategy"
    }
  ],
  "effortBreakdown": {
    "frontend": <percentage number>,
    "backend": <percentage number>,
    "devops": <percentage number>,
    "qa": <percentage number>,
    "design": <percentage number>,
    "other": <percentage number>
  },
  "techStackSuggestions": ["Technology 1", "Technology 2", ...]
}

Guidelines:
- Generate 3-5 logical phases that represent the project lifecycle.
- Generate 6-10 practical, actionable tasks spread across phases. Each task should be specific enough for a developer to start working on.
- Estimated hours should be realistic (2-16 hours per task).
- Generate 3-5 risks with varying severity levels. Be specific and practical, not generic.
- Effort breakdown percentages must sum to 100.
- Confidence score reflects how well-defined the project scope is (vague descriptions = lower score).
- Tech stack suggestions should be 3-6 specific technologies relevant to the project.
- estimatedWeeks should assume the recommended team size working standard hours.`,
        },
        {
          role: "user",
          content: `Project: ${name}\n\nDescription: ${description || "No description provided. Infer a reasonable scope from the project name."}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    const blueprint = JSON.parse(content);
    return NextResponse.json(blueprint);
  } catch (error: unknown) {
    console.error("Blueprint generation error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate blueprint";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

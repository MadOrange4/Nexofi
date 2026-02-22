import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { employees, projects } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Nexofi AI, a team management intelligence assistant. Analyze the team and project data and generate 3 actionable, concise insights for a manager.

Return a JSON object with this exact shape:
{
  "insights": [
    {
      "title": "Short bold headline (3-6 words)",
      "body": "One sentence explanation with specific names/numbers from the data",
      "type": "warning" | "suggestion" | "positive"
    }
  ]
}

Focus on: workload imbalance, employees on long breaks, task bottlenecks, skill-matching opportunities, team coverage gaps, productivity patterns. Be specific — reference actual employee names, task titles, and numbers from the data. Keep each insight under 25 words total.`,
        },
        {
          role: "user",
          content: `Team data:\n${JSON.stringify(employees, null, 2)}\n\nProjects:\n${JSON.stringify(projects, null, 2)}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("AI insights error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate insights";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { ingredient, condition } = await req.json();

    const prompt = `
      Act as a Clinical Culinary Scientist for Chef Cary Neff's Conscious Cuisine.
      Explain the specific physiological synergy between the ingredient "${ingredient}" and the medical condition "${condition}".
      
      STRUCTURE:
      1. Active Compound: Identify the primary molecule (e.g., Curcumin, Nitrates, Sulforaphane).
      2. Mechanism: How it interacts with the body for this condition.
      3. Chef's Tip: One sentence on how to prepare it to maximize bioavailability.
      
      TONE: Sophisticated, clinical, yet flavor-focused. Max 100 words.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    return NextResponse.json({ insight: completion.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: "Lab connection failed" }, { status: 500 });
  }
}
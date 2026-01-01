import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { ingredient, potentiator, condition } = await req.json();

    const prompt = `
      Act as Breanna Neff, Chief Food Scientist for Conscious Cuisine.
      Analyze the molecular interaction between:
      1. Primary Ingredient: ${ingredient}
      2. Potentiator/Method: ${potentiator}
      3. Target Condition: ${condition}
      
      Provide a "Molecular Audit" in JSON format with these exact keys:
      - activeCompound: (e.g. Curcumin, Lycopene)
      - synergyLogic: (How the potentiator increases bioavailability)
      - biologicalImpact: (How it helps the condition at a cellular level)
      - bioavailabilityScore: (A percentage 0-100)
      - breannaTip: (A one-sentence scientific pro-tip)
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    return NextResponse.json(JSON.parse(completion.choices[0].message.content || "{}"));
  } catch (error) {
    return NextResponse.json({ error: "Lab offline" }, { status: 500 });
  }
}
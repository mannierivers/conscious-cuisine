import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { userProfile, library, heroIngredient, duration } = await req.json();

  const prompt = `
    Act as Chef Cary Neff's Meal Architect. 
    User Profile: ${JSON.stringify(userProfile.medicalHistory)}
    Available Recipes: ${JSON.stringify(library.map((r: any) => r.title))}
    Hero Ingredient to prioritize: ${heroIngredient}
    Plan Duration: ${duration} days
    
    TASK: Build a ${duration}-day "Conscious Plan" using ONLY recipes from the library.
    For each day, explain WHY this sequence supports their ${userProfile.medicalHistory[0]}.
    
    Return a JSON object: { "planName": "", "days": [{ "day": 1, "lunch": "", "dinner": "", "logic": "" }] }
  `;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });

  return NextResponse.json(JSON.parse(completion.choices[0].message.content || "{}"));
}
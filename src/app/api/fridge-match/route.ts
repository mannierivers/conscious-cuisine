import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { userIngredients, library } = await req.json();

    const systemPrompt = `
      You are Chef Cary Neff's AI Sous-Chef. 
      A user has these ingredients: ${userIngredients}.
      Look through this list of recipes from Cary's library: ${JSON.stringify(library)}.
      
      TASK:
      1. Find the ONE recipe that is the best match.
      2. Provide a "Conscious Bridge" tip: How to make this dish even if they are missing 1-2 items, or how to use their specific ingredients to fit Cary's style.
      
      Format the response as a JSON object:
      { "recipeTitle": "Title", "recipeId": "ID", "bridgeTip": "Short tip..." }
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    return NextResponse.json(JSON.parse(completion.choices[0].message.content || "{}"));
  } catch (error) {
    return NextResponse.json({ error: "Concierge is busy" }, { status: 500 });
  }
}
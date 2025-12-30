import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { title, ingredients, steps, category } = await req.json();

    const systemPrompt = `
      You are a Senior Clinical Nutritionist for Chef Cary Neff's Conscious Cuisine.
      Your task is to write a "Science Nugget" for a new recipe.
      
      STANDARDS:
      - Tone: Scholarly yet accessible.
      - Focus: Bioavailability, active compounds (e.g., sulforaphane, lycopene), and physiological benefits.
      - Length: 2-3 sentences.
      - Strategy: Link a specific ingredient or cooking technique in the recipe to a clinical outcome.
      
      PHILOSOPHY: Flavor is a medical necessity. Do not sound like a clinical textbook; sound like a scientist who loves food.
    `;

    const userPrompt = `
      Analyze this recipe:
      Title: ${title}
      Category: ${category}
      Ingredients: ${ingredients.join(", ")}
      Method: ${steps.join(" ")}
      
      Draft a 3-sentence Science Nugget.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4, // Lower temperature for higher factual consistency
    });

    return NextResponse.json({ 
      suggestion: completion.choices[0]?.message?.content 
    });
  } catch (error) {
    return NextResponse.json({ error: "AI Lab Offline" }, { status: 500 });
  }
}
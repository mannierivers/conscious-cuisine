import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { recipe, medicalHistory, userName } = await req.json();

    // The "System Prompt" defines the AI's persona and logic
    const systemPrompt = `
      You are an AI Clinical Nutritionist and Culinary Consultant working for Chef Cary Neff's "Conscious Cuisine" platform.
      Your goal is to analyze recipes against a user's medical history.
      
      TONE: Professional, encouraging, and flavor-focused.
      
      LOGIC:
      1. Identify ingredients in the recipe that might conflict with the medical history.
      2. Suggest "Conscious Substitutions" that maintain the culinary integrity of Chef Neff's style.
      3. Briefly explain the "Nutrition Science" behind why the recipe (or substitution) is beneficial for their specific condition.
      4. Keep the response concise and formatted in Markdown.
    `;

    const userPrompt = `
      User: ${userName}
      Medical History: ${medicalHistory.join(", ")}
      Recipe Name: ${recipe.title}
      Ingredients: ${recipe.ingredients.join(", ")}
      
      Please provide a personalized Conscious Cuisine analysis.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      // Llama 3.3 70B is excellent for reasoning and medical logic
      model: "llama-3.3-70b-versatile",
      temperature: 0.5, // Lower temperature for more factual/stable medical advice
      max_tokens: 1024,
    });

    const response = chatCompletion.choices[0]?.message?.content || "No analysis available.";

    return NextResponse.json({ analysis: response });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate nutrition analysis" },
      { status: 500 }
    );
  }
}
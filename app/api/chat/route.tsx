import { NextResponse } from "next/server";
import axios from "axios";
export const runtime = 'edge'

export async function POST(req: Request) {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append("Access-Control-Allow-Methods", "POST");
  headers.append("Content-Type", "application/json");
  
  try {
    const { message } = await req.json();

    // Check if the message is received correctly
    if (!message) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;


    // Ensure API key is provided
    if (!apiKey) {
      return NextResponse.json({ error: "API key not set" }, { status: 500 });
    }

    // Send the request to OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiMessage = response.data.choices[0].message.content;
    console.log(aiMessage)
    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("Error connecting to AI API:", error); // Log the error
    return NextResponse.json(
      { error: "Error communicating with AI" },
      { status: 500 }
    );
  }
}

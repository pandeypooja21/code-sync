import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { generateWithGemini } from "@/config/api";

export async function POST(request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { message } = await request.json();
        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const prompt = `You are an AI chat bot who helps people in giving code and solving their problems. Your response will directly be shown in the text, so give the response like a chat. Here's the request: ${message}`;

        const aiResponse = await generateWithGemini(prompt);

        return NextResponse.json({ aiResponse }, { status: 200 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { generateWithGemini } from "@/config/api";

export async function POST(request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code, language } = await request.json();
        if (!code) {
            return NextResponse.json({ error: "Code is required" }, { status: 400 });
        }

        const prompt = `generate clear and concise documentation in the form of comments to be added at the end of the 
        code file for the code: ${code}. use the approapriate comment format for the language of the code.`;

        const documentation = await generateWithGemini(prompt);
        
        return NextResponse.json({ documentation }, { status: 200 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to generate documentation" }, { status: 500 });
    }
}

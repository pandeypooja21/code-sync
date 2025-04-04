import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { generateWithGemini } from "@/config/api";

export async function POST(request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code } = await request.json();
        if (!code) {
            return NextResponse.json({ error: "Code is required" }, { status: 400 });
        }

        // Try to fix code with AI
        let fixedCode = await fixCodeWithAI(code);
        if (fixedCode) {
            return NextResponse.json({ fixedCode, aiFixed: true }, { status: 200 });
        }

        return NextResponse.json({ error: "Failed to fix code" }, { status: 422 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}

// AI-Based Auto-Fix for Code
async function fixCodeWithAI(code) {
    try {
        // Create a prompt to fix syntax errors without needing language specification
        const prompt = `Fix the syntax errors in the following code:\n\n${code}\n\nReturn only the corrected code without any comments or formatting like markdown. Also if there are any existing comments, don't remove them.`;

        const fixedCode = await generateWithGemini(prompt);
        return fixedCode.replace(/```[a-z]*\n?/gi, "").trim(); // Remove markdown formatting
    } catch (error) {
        console.error("AI Fix Error:", error);
        return null;
    }
}

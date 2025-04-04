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

        const prompt = `
        Generate documentation for the following code.
        Ensure that the documentation is in the form of inline comments to be added at the end of the file. 
        Dont write comment for each and every line of code.
        Use the appropriate comment style for the provided language.
        Dont include the language at the top just the comments.
        do not include the code or any markdowns just the comments.
        and make it as detailed and descriptive as possible.
        Code:
        ${code}
        `;

        let documentation = await generateWithGemini(prompt);

        // Clean up the response
        documentation = documentation.replace(code, "").trim(); // Remove the code if it appears
        documentation = documentation.replace(language, "").trim(); 
        documentation = documentation.replace(/`{3}/g, "").replace(/`{3}$/g, "");

        return NextResponse.json({ documentation }, { status: 200 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to generate documentation" }, { status: 500 });
    }
}

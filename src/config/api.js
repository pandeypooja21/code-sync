import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Initialize Resender
const resenderApiKey = process.env.RESENDER_API_KEY;
const resenderBaseUrl = "https://api.resend.com";

// Gemini helper function
export async function generateWithGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Resender helper function
export async function sendEmail({ to, subject, html }) {
  const response = await fetch(`${resenderBaseUrl}/v1/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resenderApiKey}`,
    },
    body: JSON.stringify({
      from: "noreply@yourdomain.com", // Update this with your verified domain
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send email");
  }

  return response.json();
}

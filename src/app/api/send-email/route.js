import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { sendEmail } from "@/config/api";

export async function POST(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Hello, Coder!</h2>
          <p>Your verification code for SynapseCode is:</p>
          <h3 style="color: green;">${code}</h3>
          <p>Please enter this code on the website to verify your email.</p>
          <p>Thank you!</p>
          <p style="font-size: 12px; color: gray;">
            SynapseCode | Your Company Address | Contact Support
          </p>
          <p style="font-size: 12px; color: gray;">If you didn't request this, please ignore this email.</p>
        </div>
      </body>
    </html>
    `;

    await sendEmail({
      to: email,
      subject: 'SynapseCode | Verification Code',
      html
    });

    return NextResponse.json({ success: true, message: "Verification email sent!" });
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

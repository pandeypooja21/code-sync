"use client";

import { useSignUp } from "@clerk/nextjs";

export const signUpUser = async (email, password, displayName) => {
  try {
    const { signUp, setActive } = useSignUp();
    if (!signUp) throw new Error("Sign up not ready");

    const result = await signUp.create({
      emailAddress: email,
      password,
      username: displayName,
    });

    if (result.status === "complete") {
      await setActive({ session: result.createdSessionId });
      return { success: true, message: "Account created successfully!" };
    } else {
      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      return { 
        success: true, 
        message: "Verification email sent. Please check your inbox.",
        signUpId: result.id
      };
    }
  } catch (error) {
    console.error("Sign-up error:", error);
    return { success: false, message: error.message || "An error occurred during sign up" };
  }
};

export const verifyEmailCode = async (code, signUpId) => {
  try {
    const { signUp, setActive } = useSignUp();
    if (!signUp) throw new Error("Sign up not ready");

    const result = await signUp.attemptEmailAddressVerification({
      code,
    });

    if (result.status === "complete") {
      await setActive({ session: result.createdSessionId });
      return { success: true, message: "Email verified successfully!" };
    } else {
      return { success: false, message: "Invalid verification code" };
    }
  } catch (error) {
    console.error("Verification error:", error);
    return { success: false, message: error.message || "An error occurred during verification" };
  }
};

export const signInWithOAuth = async (strategy) => {
  try {
    const { signUp, setActive } = useSignUp();
    if (!signUp) throw new Error("Sign up not ready");

    await signUp.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard",
    });

    return { success: true };
  } catch (error) {
    console.error("OAuth error:", error);
    return { success: false, message: error.message || "An error occurred during OAuth sign in" };
  }
};
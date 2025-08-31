import React, { useState } from "react";

import { Button } from "./ui/button";
import { Icons } from "./ui/icons";
import { useToast } from "./ui/use-toast";

import { supabase } from "@/lib/supabase";
import { errorMessage } from "app/client/lib/errors";

interface GoogleSignInProps {
  redirectTo?: string;
  children?: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function GoogleSignIn({
  redirectTo = "/dashboard",
  children,
  variant = "outline",
  size = "default",
}: GoogleSignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw error;
      }

      // Success will redirect automatically
      toast({
        title: "Redirecting...",
        description: "Connecting with Google authentication.",
        duration: 2000,
      });
    } catch (err: unknown) {
      console.error("Google sign-in error:", err);
      toast({
        title: "Authentication Failed",
        description:
          err instanceof Error
            ? errorMessage(err)
            : "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.google className="mr-2 h-4 w-4" />
      )}
      {children || "Continue with Google"}
    </Button>
  );
}

export default GoogleSignIn;

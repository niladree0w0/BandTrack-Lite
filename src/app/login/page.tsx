
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons/logo";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState(""); // Changed from username to email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if already logged in and not loading
    if (!authIsLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authIsLoading, router]);

  if (authIsLoading && !user) { // Show loading only if not already logged in
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  // If user is already defined (and not loading), and useEffect hasn't redirected yet,
  // returning null avoids rendering the login form momentarily before redirect.
  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);
    const success = await login(email, password); // Pass email to login
    if (!success) {
      setError("Invalid email or password.");
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please check your credentials or ensure the user exists in Firebase.",
        variant: "destructive",
      });
    }
    // onAuthStateChanged in AuthContext will handle successful redirect
    setIsLoggingIn(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="items-center text-center">
          <Logo className="h-10 w-10 mb-2 text-primary" />
          <CardTitle className="text-2xl">BandTrack Lite</CardTitle>
          <CardDescription>Please sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label> 
              <Input
                id="email"
                type="email" // Changed to email
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com" // Updated placeholder
                required
                disabled={isLoggingIn}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoggingIn}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
            <p>Use your registered email and password.</p>
        </CardFooter>
      </Card>
    </div>
  );
}

// Login.jsx — Updated for new Admin API
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Clear any previous login status when Login page loads
  useEffect(() => {
    localStorage.removeItem("adminLoggedIn");
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://localhost:7245/api/Admin/login", {
        method: "POST",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        toast.error(data.message || "Invalid username or password", {
          position: "top-right",
        });
        return;
      }

      // SUCCESS: Save login status
      localStorage.setItem("adminLoggedIn", "true");

      toast.success(data.message || "Admin login successful!", {
        position: "top-right",
      });

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error. Please try again.", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="relative">
            <div className="absolute h-46 w-46 bg-green-300 rounded-full -top-20 -left-20 bg-[linear-gradient(135deg,#32b171,#b5f7d6)]" />
            <div className="absolute h-46 w-46 bg-green-300 rounded-full -bottom-20 -right-20 bg-[linear-gradient(135deg,#d8f3f9,#60c1d6)]" />

            <Card className="relative z-10 bg-white/30 dark:bg-black/30 backdrop-blur-md shadow-lg">
              <CardHeader className="text-center">
                <img src="./logo.png" alt="logo" className="max-h-14 w-fit mx-auto" />
                <CardTitle className="text-xl">Admin Login</CardTitle>
                <CardDescription>Enter your credentials to access the dashboard</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="admin123"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                      />
                    </div>

                    <div className="grid gap-3 relative">
                      <div className="flex flex-row justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button
                          type="button"
                          onClick={() => navigate("/forgetpassword")}
                          className="text-sm text-primary hover:underline"
                        >
                          Forget password?
                        </button>
                      </div>

                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-10 text-gray-500"
                      >
                        {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                      </button>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>

                  <div className="text-center text-sm mt-3">
                    Don't have access?{" "}
                    <a href="#" className="underline underline-offset-4 ml-1">
                      Contact Support
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="text-muted-foreground text-center text-xs text-balance">
            By logging in, you agree to our{" "}
            <a href="#" className="underline underline-offset-4">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Login;
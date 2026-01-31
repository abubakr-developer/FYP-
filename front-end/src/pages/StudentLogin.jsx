import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, AlertCircle, Info, ArrowLeft } from "lucide-react";
import { loginSchema, validateForm } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";

// API base URL (configurable via .env)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function StudentLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const field = id.split("-").pop(); // student-email → email
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleLogin = async () => {
    setIsSubmitting(true);
    setErrors({}); // clear previous field errors

    // Client-side validation
    const result = validateForm(loginSchema, formData);

    if (!result.success) {
      setErrors(result.errors);
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Please enter valid email and password.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          role: "student", // optional - helps backend know which collection to check
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show backend error message (wrong credentials, user not found, etc.)
        toast({
          title: "Login Failed",
          description: data.message || "Invalid email or password",
          variant: "destructive",
        });
        throw new Error(data.message || "Authentication failed");
      }

      // Success - store token and user info
      if (data.token) {
        localStorage.setItem("token", data.token);
        // Optional: store more user data if returned
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to your dashboard...",
      });

      // Redirect after short delay for better UX
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/student-dashboard");
    }, 800);

    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (field) => {
    if (!errors[field]) return null;
    return (
      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
        <AlertCircle className="h-3 w-3" />
        {errors[field]}
      </p>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-background dark:from-blue-950/20 dark:via-cyan-950/10 dark:to-background">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 mb-6 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Student Login</h1>
          <p className="text-muted-foreground">
            Sign in to access your personalized dashboard
          </p>
        </div>

        {/* Demo Alert - can be removed later */}
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-sm text-blue-900 dark:text-blue-200">
            Enter your registered email and password to sign in.
          </AlertDescription>
        </Alert>

        {/* Login Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle>Welcome Back, Student!</CardTitle>
            <CardDescription>
              Enter your credentials to continue your journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student-email">Email Address</Label>
              <Input 
                id="student-email" 
                type="email" 
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleChange}
                maxLength={255}
                className={errors.email ? "border-destructive" : ""}
              />
              {renderError("email")}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="student-password">Password</Label>
                <Link to="#" className="text-sm text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <Input 
                id="student-password" 
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                maxLength={128}
                className={errors.password ? "border-destructive" : ""}
              />
              {renderError("password")}
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" 
              onClick={handleLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  New to Unisphere?
                </span>
              </div>
            </div>

            <Link to="/register">
              <Button variant="outline" className="w-full">
                Create Student Account
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Looking for a different portal?{" "}
            <Link to="/" className="text-primary hover:underline">
              Go back to select role
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
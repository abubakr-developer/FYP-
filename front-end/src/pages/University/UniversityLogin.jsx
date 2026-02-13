import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, AlertCircle, Info, ArrowLeft } from "lucide-react";
import { loginSchema, validateForm } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export default function UniversityLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define API base URL from env or fallback to localhost
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    const { id, value } = e.target;
    const field = id.split("-").pop();
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleLogin = async () => {
    setIsSubmitting(true);

    const result = validateForm(loginSchema, formData);

    if (!result.success) {
      setErrors(result.errors);
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/university/login`, {
        email: formData.email.trim(),
        password: formData.password,
      }, { withCredentials: true });

      toast({
        title: "Login Successful",
        description: response.data.message || "Welcome to the University Portal",
      });

      if (response.data.token) {
        localStorage.setItem("universityToken", response.data.token);
      }

      navigate("/university-dashboard");

    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Something went wrong. Please try again.";

      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (status === 400 && data?.errors) {
          setErrors(data.errors);
          errorMessage = "Please check the highlighted fields.";
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (error.request) {
        errorMessage = "Cannot reach the server. Check your connection or server status.";
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-background dark:from-purple-950/20 dark:via-pink-950/10 dark:to-background">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 mb-6 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">University Portal</h1>
          <p className="text-muted-foreground">
            Manage your institution's profile and programs
          </p>
        </div>

        <Alert className="mb-6 border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/20">
          <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <AlertDescription className="text-sm text-purple-900 dark:text-purple-200">
            <strong>Note:</strong> Authentication is connected to the backend.
          </AlertDescription>
        </Alert>

        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle>Institution Login</CardTitle>
            <CardDescription>
              Access your university administration panel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="university-email">Institution Email</Label>
              <Input
                id="university-email"
                type="email"
                placeholder="admin@university.edu"
                value={formData.email}
                onChange={handleChange}
                maxLength={255}
                className={errors.email ? "border-destructive" : ""}
                disabled={isSubmitting}
              />
              {renderError("email")}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="university-password">Password</Label>
                <Link to="#" className="text-sm text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <Input
                id="university-password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                maxLength={128}
                className={errors.password ? "border-destructive" : ""}
                disabled={isSubmitting}
              />
              {renderError("password")}
            </div>
            <Button
              variant="outline"
              className="w-full mt-2"
              disabled={isSubmitting}
              onClick={handleLogin}
            >
              Login
            </Button>

<CardDescription>
    If you don't have an account yet, please register your university to access the portal.
  </CardDescription>

<Link to="/university-register">
  <Button
    variant="outline"
    className="w-full mt-2"
    disabled={isSubmitting}
  >
    Register Your University
  </Button>
</Link>


            

            
          </CardContent>
        </Card>

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
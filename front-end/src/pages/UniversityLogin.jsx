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

export default function UniversityLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const field = id.split("-").pop();
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleLogin = () => {
    setIsSubmitting(true);
    
    const result = validateForm(loginSchema, formData);
    
    if (!result.success) {
      setErrors(result.errors);
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Please enter valid credentials.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Demo Mode",
      description: "Navigating to University dashboard. Full authentication coming soon!",
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/university-dashboard");
    }, 800);
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">University Portal</h1>
          <p className="text-muted-foreground">
            Manage your institution's profile and programs
          </p>
        </div>

        {/* Demo Alert */}
        <Alert className="mb-6 border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/20">
          <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <AlertDescription className="text-sm text-purple-900 dark:text-purple-200">
            <strong>Demo Mode:</strong> Enter any email and password to access the dashboard.
          </AlertDescription>
        </Alert>

        {/* Login Card */}
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
              />
              {renderError("password")}
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
              onClick={handleLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In to Portal"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Need Help?
                </span>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg text-sm">
              <p className="font-semibold mb-2">University Registration</p>
              <p className="text-muted-foreground">
                To register your institution, please contact our admin team at{" "}
                <a href="mailto:support@unisphere.edu" className="text-primary hover:underline">
                  support@unisphere.edu
                </a>
              </p>
            </div>
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
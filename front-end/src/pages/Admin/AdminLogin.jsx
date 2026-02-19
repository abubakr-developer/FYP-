import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, Info, ArrowLeft, Lock } from "lucide-react";
import { loginSchema, validateForm } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLogin() {
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

  const handleLogin = async () => {
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

    try {
      const response = await axios.post(
        `${API_URL}/api/superadmin/login`,
        { email: formData.email.trim().toLowerCase(), password: formData.password },
        { withCredentials: true }
      );

      // Backend returns user + token and sets cookie. Ensure the logged-in user is a super admin
      const user = response.data?.user;
      if (!user) {
        throw new Error("Invalid server response: missing user info");
      }

      if (user.role !== 'superAdmin') {
        toast({
          title: "Unauthorized",
          description: "This account is not a super admin.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("adminToken", response.data.token);

      toast({
        title: "Welcome",
        description: "Logged in as Super Admin",
      });

      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "Login Error",
        description: error.response?.data?.message || error.message || "Failed to sign in",
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-red-50 to-background dark:from-orange-950/20 dark:via-red-950/10 dark:to-background">
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">
            System administration and platform management
          </p>
        </div>

        {/* Security Notice */}
        <Alert className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
          <Lock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-sm text-orange-900 dark:text-orange-200">
            <strong>Secure Access:</strong> This is a restricted area. Unauthorized access is prohibited.
          </AlertDescription>
        </Alert>

        {/* Login Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle>Administrator Access</CardTitle>
            <CardDescription>
              Sign in with your administrative credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input 
                id="admin-email" 
                type="email" 
                placeholder="admin@unisphere.edu"
                value={formData.email}
                onChange={handleChange}
                maxLength={255}
                className={errors.email ? "border-destructive" : ""}
              />
              {renderError("email")}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password">Password</Label>
                <Link to="#" className="text-sm text-primary hover:underline">
                  Reset
                </Link>
              </div>
              <Input 
                id="admin-password" 
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
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" 
              onClick={handleLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Authenticating..." : "Sign In to Admin Panel"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                  Security Notice
                </span>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Administrator Guidelines</p>
                  <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
                    <li>• Use strong, unique passwords</li>
                    <li>• Enable two-factor authentication</li>
                    <li>• Never share your credentials</li>
                    <li>• Log out after each session</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Not an administrator?{" "}
            <Link to="/" className="text-primary hover:underline">
              Go back to select role
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
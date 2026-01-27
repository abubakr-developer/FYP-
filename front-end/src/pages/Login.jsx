import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, AlertCircle, Info } from "lucide-react";
import { loginSchema, validateForm } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Extract field name from id (e.g., "student-email" -> "email")
    const field = id.includes("-") ? id.split("-").pop() : id;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleLogin = (role, dashboardPath) => {
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

    // Note: In a real application, this would call an authentication API
    // Currently this is a demo without backend authentication
    toast({
      title: "Demo Mode",
      description: `Navigating to ${role} dashboard. Full authentication coming soon!`,
    });
    setIsSubmitting(false);
    navigate(dashboardPath);
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <GraduationCap className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Unisphere
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue your journey</p>
        </div>

        <Alert className="mb-4 border-primary/20 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Demo Mode:</strong> This is a demo application. Full authentication with secure login will be available when backend is enabled.
          </AlertDescription>
        </Alert>

        <Card className="border-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="university">University</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
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
                  <Label htmlFor="student-password">Password</Label>
                  <Input 
                    id="student-password" 
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    maxLength={128}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {renderError("password")}
                </div>
                <div className="flex items-center justify-between">
                  <Link to="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleLogin("student", "/student-dashboard")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In as Student"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </TabsContent>

              <TabsContent value="university" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="uni-email">Email</Label>
                  <Input 
                    id="uni-email" 
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
                  <Label htmlFor="uni-password">Password</Label>
                  <Input 
                    id="uni-password" 
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    maxLength={128}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {renderError("password")}
                </div>
                <div className="flex items-center justify-between">
                  <Link to="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleLogin("university", "/university-dashboard")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In as University"}
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
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
                  <Label htmlFor="admin-password">Password</Label>
                  <Input 
                    id="admin-password" 
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    maxLength={128}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {renderError("password")}
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleLogin("admin", "/admin-dashboard")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In as Admin"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

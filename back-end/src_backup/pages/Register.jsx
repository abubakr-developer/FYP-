import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, AlertCircle } from "lucide-react";
import { registerSchema, validateForm } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    percentage: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Map input ids to form data keys
    const fieldMap = {
      "first-name": "firstName",
      "last-name": "lastName",
      "email": "email",
      "phone": "phone",
      "password": "password",
      "confirm-password": "confirmPassword",
      "percentage": "percentage",
    };
    const field = fieldMap[id] || id;
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Parse percentage as number for validation
    const dataToValidate = {
      ...formData,
      percentage: formData.percentage ? parseFloat(formData.percentage) : 0,
    };

    const result = validateForm(registerSchema, dataToValidate);

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

    // Note: In a real application, this would call an authentication API
    // Currently this is a demo without backend authentication
    toast({
      title: "Demo Mode",
      description: "Registration would be processed here. Backend authentication coming soon!",
    });
    setIsSubmitting(false);
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
          <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Join thousands of students finding their perfect university</p>
        </div>

        <Card className="border-2">
          <CardContent className="pt-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input 
                    id="first-name" 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={handleChange}
                    maxLength={50}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {renderError("firstName")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input 
                    id="last-name" 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={handleChange}
                    maxLength={50}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {renderError("lastName")}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
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
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+92 300 1234567" 
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={20}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {renderError("phone")}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  maxLength={128}
                  className={errors.password ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  Min 8 characters with uppercase, lowercase, and number
                </p>
                {renderError("password")}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  maxLength={128}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {renderError("confirmPassword")}
              </div>

              <div className="space-y-2">
                <Label htmlFor="percentage">Intermediate Percentage</Label>
                <Input 
                  id="percentage" 
                  type="number" 
                  placeholder="85" 
                  min="0" 
                  max="100" 
                  value={formData.percentage}
                  onChange={handleChange}
                  className={errors.percentage ? "border-destructive" : ""}
                />
                {renderError("percentage")}
              </div>

              <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

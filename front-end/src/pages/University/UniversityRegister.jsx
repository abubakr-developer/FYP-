import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, AlertCircle, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define API base URL (uses .env variable or fallback to localhost)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function UniversityRegister() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    institutionName: "",
    officialEmail: "",
    contactPerson: "",
    designation: "",
    phone: "",
    website: "",
    address: "",
    institutionType: "private",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Reset previous field-specific errors
    setErrors({});

    // Basic client-side validation
    const requiredFields = [
      "institutionName",
      "officialEmail",
      "contactPerson",
      "phone",
      "password",
      "confirmPassword",
    ];

    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")
        } is required`;
      }
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Optional: more client-side checks (email format, phone, etc.)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.officialEmail && !emailRegex.test(formData.officialEmail)) {
      newErrors.officialEmail = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/university/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Safely parse the response: if the server returns HTML (e.g., 404 or a redirect page)
      // avoid calling response.json() directly which would throw the "Unexpected token '<'" error.
      const contentType = response.headers.get("content-type") || "";
      let data;
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Expected JSON response but received: ${text.slice(0, 300)}`);
      }

      if (!response.ok) {
        // Show backend validation error (single message or field-specific)
        if (data.message) {
          toast({
            title: "Registration Failed",
            description: data.message,
            variant: "destructive",
          });
        }
        // Optional: map field-specific errors if backend sends them
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.message || "Something went wrong");
      }

      // Success
      toast({
        title: "Registration Submitted",
        description: data.message || "Your institution registration is pending approval.",
      });

      // Navigate to a pending/confirmation page
      navigate("/university-login");

      // Optional: store token if you want to auto-login after approval later
      if (data.token) {
        localStorage.setItem("universityToken", data.token);
      }

    } catch (error) {
      console.error("University registration error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to connect to the server. Please try again later.",
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <GraduationCap className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Unisphere
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Register Your Institution</h1>
          <p className="text-muted-foreground">
            Join Unisphere to connect with talented students across Pakistan
          </p>
        </div>

        <Card className="border-2">
          <CardContent className="pt-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="institutionName">University / Institution Name *</Label>
                <Input
                  id="institutionName"
                  placeholder="e.g. University of the Punjab, Lahore"
                  value={formData.institutionName}
                  onChange={handleChange}
                  className={errors.institutionName ? "border-destructive" : ""}
                />
                {renderError("institutionName")}
              </div>

              <div className="space-y-2">
                <Label htmlFor="officialEmail">Official Email *</Label>
                <Input
                  id="officialEmail"
                  type="email"
                  placeholder="registrar@university.edu.pk"
                  value={formData.officialEmail}
                  onChange={handleChange}
                  className={errors.officialEmail ? "border-destructive" : ""}
                />
                {renderError("officialEmail")}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person Name *</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Mr. Ahmed Khan"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className={errors.contactPerson ? "border-destructive" : ""}
                  />
                  {renderError("contactPerson")}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    placeholder="Registrar / Admission Officer"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+92 51 1234567"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {renderError("phone")}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Official Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://www.university.edu.pk"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Sector H-8, Islamabad"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Institution Type</Label>
                <select
                  id="institutionType"
                  value={formData.institutionType}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="semi-government">Semi-Government</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters with uppercase, lowercase, and number
                </p>
                {renderError("password")}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {renderError("confirmPassword")}
              </div>

              <Button
                className="w-full"
                size="lg"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Register Institution"}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <Link to="/university-login" className="text-primary hover:underline">
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
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, AlertCircle, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic client-side validation (replace/improve with zod schema later)
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

    // Optional: add more specific checks (email format, phone regex, etc.)

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Please complete all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    // Demo mode simulation
    toast({
      title: "Demo Mode",
      description: "University registration simulated. Backend & approval flow coming soon!",
    });

    setIsSubmitting(false);

    // In real app → navigate("/university-pending-approval") or similar
    // navigate("/university-dashboard");
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
                  Minimum 8 characters
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
// src/pages/StudentProfile.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function StudentProfile() {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    intermediatePercentage: "",
    fieldOfInterest: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({ title: "Error", description: "Please log in again.", variant: "destructive" });
          return;
        }
        const res = await axios.get(`${API_URL}/api/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        setProfileData({
          // FIX: Combine firstName and lastName into fullName for display (backend returns separate fields)
          fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          email: data.email || "",
          intermediatePercentage: data.intermediatePercentage || "",
          fieldOfInterest: data.fieldOfInterest || "",
        });
      } catch (err) {
        toast({ title: "Error", description: err.response?.data?.message || "Failed to load profile", variant: "destructive" });
      }
    };
    fetchProfile();
  }, [toast]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: null }));
  };

  const handleSelectChange = (value) => {
    setProfileData((prev) => ({ ...prev, fieldOfInterest: value }));
    if (errors.fieldOfInterest) setErrors((prev) => ({ ...prev, fieldOfInterest: null }));
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!profileData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!profileData.email.trim() || !/\S+@\S+\.\S+/.test(profileData.email)) newErrors.email = "Valid email is required";
    const perc = parseFloat(profileData.intermediatePercentage);
    if (isNaN(perc) || perc < 33 || perc > 100) newErrors.intermediatePercentage = "Percentage must be between 33 and 100";
    if (!profileData.fieldOfInterest) newErrors.fieldOfInterest = "Field of interest is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast({ title: "Validation Error", description: "Please fix the errors.", variant: "destructive" });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // FIX: Improved splitting to handle multiple spaces/extra names
      const nameParts = profileData.fullName.trim().split(/\s+/);
      const firstName = nameParts.shift() || '';
      const lastName = nameParts.join(' ');

      const payload = {
        firstName,
        lastName,
        email: profileData.email,
        intermediatePercentage: profileData.intermediatePercentage,
        fieldOfInterest: profileData.fieldOfInterest,
      };

      await axios.post(`${API_URL}/api/student/update-profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast({ title: "Success", description: "Profile saved successfully" });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
        // You might want to add navigation here, e.g., window.location.href = '/student-login';
      }
      toast({ title: "Error", description: err.response?.data?.message || "Failed to save profile", variant: "destructive" });
    }
  };

  const renderError = (field) =>
    errors[field] ? (
      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
        <AlertCircle className="h-3 w-3" />
        {errors[field]}
      </p>
    ) : null;

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={profileData.fullName}
            onChange={handleChange}
            maxLength={100}
            className={errors.fullName ? "border-destructive" : ""}
          />
          {renderError("fullName")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={profileData.email}
            onChange={handleChange}
            maxLength={255}
            className={errors.email ? "border-destructive" : ""}
          />
          {renderError("email")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="intermediatePercentage">Intermediate Percentage (33-100)</Label>
          <Input
            id="intermediatePercentage"
            type="number"
            placeholder="e.g., 85"
            value={profileData.intermediatePercentage}
            onChange={handleChange}
            min="33"
            max="100"
            step="0.01"
            className={errors.intermediatePercentage ? "border-destructive" : ""}
          />
          {renderError("intermediatePercentage")}
        </div>
        <div className="space-y-2">
          <Label>Field of Interest</Label>
          <Select value={profileData.fieldOfInterest} onValueChange={handleSelectChange}>
            <SelectTrigger className={errors.fieldOfInterest ? "border-destructive" : ""}>
              <SelectValue placeholder="Select your interest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Faculty of Computing & Information Technology">Faculty of Computing & Information Technology</SelectItem>
              <SelectItem value="Faculty of Engineering & Architecture">Faculty of Engineering & Architecture</SelectItem>
              <SelectItem value="Faculty of Humanities & Social Sciences">Faculty of Humanities & Social Sciences</SelectItem>
              <SelectItem value="Faculty of Law">Faculty of Law</SelectItem>
              <SelectItem value="Faculty of Management & Administrative Sciences">Faculty of Management & Administrative Sciences</SelectItem>
              <SelectItem value="Faculty of Sciences">Faculty of Sciences</SelectItem>
              <SelectItem value="Faculty of Pharmacy & Allied Health Sciences">Faculty of Pharmacy & Allied Health Sciences</SelectItem>
              <SelectItem value="Faculty of Textile & Fashion Designing">Faculty of Textile & Fashion Designing</SelectItem>
            </SelectContent>
          </Select>
          {renderError("fieldOfInterest")}
        </div>
        <Button className="md:col-span-2" onClick={handleSave}>
          Save Profile
        </Button>
      </CardContent>
    </Card>
  );
}
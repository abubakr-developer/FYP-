// src/pages/StudentScholarships.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function StudentScholarships() {
  const { toast } = useToast();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({ title: "Error", description: "Please log in again.", variant: "destructive" });
          setLoading(false);
          return;
        }
        const [scholarshipsRes, recommendationsRes] = await Promise.all([
          axios.get(`${API_URL}/api/student/scholarships`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/student/recommendations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const allScholarships = scholarshipsRes.data.data || [];
        const eligibleUniIds = new Set((recommendationsRes.data.data?.eligible || []).map(u => u._id));
        setScholarships(allScholarships.filter(s => eligibleUniIds.has(s.universityId)));
      } catch (err) {
        toast({ title: "Error", description: err.response?.data?.message || "Failed to load scholarships. Set your field of interest in profile.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, [toast]);

  if (loading) return <p className="text-center">Loading scholarships...</p>;
  if (scholarships.length === 0) return <p className="text-center">No scholarships available for your field of interest.</p>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {scholarships.map((s) => (
        <Card key={s._id} className="border-2">
          <CardHeader>
            <CardDescription className="font-bold text-foreground">{s.universityName}</CardDescription>
            <CardTitle>{s.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary font-semibold">Scholarship: {s.percentage ? `${s.percentage}%` : "N/A"}</p>
            {s.eligibility && <p className="text-sm mt-2"><span className="font-semibold">Eligibility:</span> {s.eligibility}</p>}
            {s.description && <p className="text-sm text-muted-foreground mt-2">{s.description}</p>}
            {/* <Button className="w-full mt-4">Apply</Button> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
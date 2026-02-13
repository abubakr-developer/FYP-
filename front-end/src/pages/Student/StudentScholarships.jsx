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
        const res = await axios.get(`${API_URL}/api/student/scholarships`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setScholarships(res.data.data);
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
            <CardTitle>{s.title}</CardTitle>
            <CardDescription>{s.universityName}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-primary font-semibold">{s.amount}</p>
            {s.description && <p className="text-sm text-muted-foreground mt-2">{s.description}</p>}
            <Button className="w-full mt-4">Apply</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
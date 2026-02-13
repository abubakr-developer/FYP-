// src/pages/StudentEvents.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function StudentEvents() {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({ title: "Error", description: "Please log in again.", variant: "destructive" });
          setLoading(false);
          return;
        }
        const res = await axios.get(`${API_URL}/api/student/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data.data);
      } catch (err) {
        toast({ title: "Error", description: err.response?.data?.message || "Failed to load events.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [toast]);

  if (loading) return <p className="text-center">Loading events...</p>;
  if (events.length === 0) return <p className="text-center">No upcoming events.</p>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {events.map((e) => (
        <Card key={e._id} className="border-2">
          <CardHeader>
            <CardTitle>{e.title}</CardTitle>
            <CardDescription>{e.universityName} • {new Date(e.date).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{e.description}</p>
            {e.location && <p className="text-sm text-muted-foreground mt-2">Location: {e.location}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
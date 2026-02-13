// src/pages/StudentRecommendations.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function StudentRecommendations() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({ title: "Error", description: "Please log in again.", variant: "destructive" });
          setLoading(false);
          return;
        }
        const res = await axios.get(`${API_URL}/api/student/recommendations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecommendations(res.data.data);
      } catch (err) {
        toast({ title: "Error", description: err.response?.data?.message || "Failed to load recommendations. Complete your profile.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [toast]);

  if (loading) return <p className="text-center">Loading recommendations...</p>;
  if (!recommendations) return <p className="text-center">Complete your profile in the Profile tab to get recommendations.</p>;

  return (
    <>
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            Based on your {recommendations.studentPercentage}% and interest in {recommendations.fieldOfInterest}
          </CardDescription>
        </CardHeader>
      </Card>
      {recommendations.eligible.length === 0 && recommendations.notEligible.length === 0 ? (
        <p className="text-center">No recommendations available based on your criteria.</p>
      ) : (
        <>
          <h3 className="text-xl font-semibold mt-6">Eligible Universities & Programs</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.eligible.map((uni) => (
              <Card key={uni._id} className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">{uni.universityName}</CardTitle>
                  <CardDescription>{uni.address} • Rating: {uni.rating}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 font-medium">Eligible Programs:</p>
                  <ul className="list-disc pl-4 mb-4 space-y-1">
                    {uni.programs.map((prog) => (
                      <li key={prog._id}>
                        {prog.name} - {prog.level} ({prog.duration} years) • Fee: {prog.feePerSemester}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/universities/${uni._id}`}>View Details & Apply</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {recommendations.notEligible.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-6">Other Universities (Not Eligible)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {recommendations.notEligible.map((uni) => (
                  <Card key={uni._id} className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">{uni.universityName}</CardTitle>
                      <CardDescription>{uni.address} • Rating: {uni.rating}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2 font-medium">Programs:</p>
                      <ul className="list-disc pl-4 mb-4 space-y-1">
                        {uni.programs.map((prog) => (
                          <li key={prog._id}>
                            {prog.name} - Reason: {prog.reason}
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/universities/${uni._id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
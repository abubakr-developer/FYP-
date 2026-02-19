// src/pages/StudentRecommendations.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // ← add this import
import { AlertTriangle, TrendingUp } from "lucide-react"; // ← optional icon
import { Link } from "react-router-dom";
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
          toast({
            title: "Error",
            description: "Please log in again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_URL}/api/student/recommendations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRecommendations(res.data.data);
      } catch (err) {
        console.error("Recommendations fetch error:", err);
        toast({
          title: "Error",
          description:
            err.response?.data?.message ||
            "Failed to load recommendations. Please complete your profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [toast]);

  if (loading)
    return <p className="text-center py-12">Loading recommendations...</p>;

  if (!recommendations) {
    return (
      <p className="text-center py-12 text-muted-foreground">
        Complete your profile in the Profile tab to get personalized
        recommendations.
      </p>
    );
  }

  const hasAnyRecommendations =
    recommendations.eligible.length > 0 ||
    recommendations.notEligible.length > 0;

  return (
    <div className="space-y-8">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            Based on your {recommendations.studentPercentage}% and interest in{" "}
            {recommendations.fieldOfInterest}
          </CardDescription>
        </CardHeader>
      </Card>

      {!hasAnyRecommendations ? (
        <div className="text-center py-10 text-muted-foreground">
          No recommendations available based on your current profile.
        </div>
      ) : (
        <>
          {/* Eligible Section */}
          {recommendations.eligible.length > 0 && (
            <>
              <h3 className="text-xl font-semibold">
                Eligible Universities & Programs
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.eligible.map((uni) => (
                  <Card key={uni._id} className="border-2 flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {uni.universityName}
                      </CardTitle>
                      <CardDescription>
                        {uni.address} • Rating: {uni.rating}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="mb-2 font-medium">Eligible Programs:</p>
                      <ul className="list-disc pl-5 mb-6 space-y-1.5 flex-1">
                        {uni.programs.map((prog) => (
                          <li key={prog._id}>
                            {prog.name} – {prog.level} ({prog.duration} years) •
                            Fee: {prog.feePerSemester}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant="default"
                        className="w-full mt-auto"
                        asChild
                      >
                        <Link
                          to={`/universitydetailinformation/${uni._id}?mode=eligible&department=${encodeURIComponent(recommendations.fieldOfInterest)}`}
                        >
                          View Details & Apply
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Not Eligible Section */}
          {recommendations.notEligible.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-10">
                Programs (Not Eligible)
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.notEligible.map((uni) => (
                  <Card key={uni._id} className="border-2 flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {uni.universityName}
                        </CardTitle>
                        <Badge
                          variant="destructive"
                          className="flex items-center gap-1"
                        >
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Not Eligible
                        </Badge>
                      </div>
                      <CardDescription>
                        {uni.address} • Rating: {uni.rating}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="mb-2 font-medium">Programs:</p>
                      <ul className="list-disc pl-5 mb-6 space-y-1.5 flex-1">
                        {uni.programs.map((prog) => (
                          <li key={prog._id} className="text-muted-foreground">
                            {prog.name} – Reason:{" "}
                            <span className="text-destructive">
                              {prog.reason}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant="outline"
                        className="w-full mt-auto"
                        asChild
                      >
                        <Link
                          to={`/universitydetailinformation/${uni._id}?mode=ineligible&department=${encodeURIComponent(recommendations.fieldOfInterest)}`}
                        >
                          View Details
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

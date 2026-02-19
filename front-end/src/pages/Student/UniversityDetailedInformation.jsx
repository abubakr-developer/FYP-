// src/pages/UniversityDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";   // ← add useLocation
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GraduationCap, ExternalLink, MapPin, Star, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function UniversityDetail() {
  const { id } = useParams();
  const location = useLocation();                    // ← added
  const { toast } = useToast();

  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Read mode from URL query (?mode=eligible or ?mode=ineligible)
  const searchParams = new URLSearchParams(location.search);
  const viewMode = searchParams.get("mode") || "full";  // default = show all
  const department = searchParams.get("department");

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const token = localStorage.getItem("token");
        let res;

        // If logged in, use student endpoint to get eligibility and faculty data
        if (token) {
          res = await axios.get(`${API_URL}/api/student/universities/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          // Fallback for public view
          res = await axios.get(`${API_URL}/api/superadmin/universities/${id}`);
        }
        
        setUniversity(res.data.data || res.data);
      } catch (err) {
        console.error("University fetch error:", err);
        toast({
          title: "Error",
          description: "Could not load university information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [id, toast]);

  if (loading) {
    return <div className="text-center py-12">Loading university details...</div>;
  }

  if (!university) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">University not found</h2>
        <Button variant="outline" className="mt-6" asChild>
          <Link to="/student-dashboard">Back to Universities</Link>
        </Button>
      </div>
    );
  }

  // Filter programs based on viewMode
  let displayedPrograms = university.programs || [];

  if (viewMode === "eligible") {
    displayedPrograms = displayedPrograms.filter(p => p.isEligible);
  } else if (viewMode === "ineligible") {
    displayedPrograms = displayedPrograms.filter(p => !p.isEligible);
  }

  // Filter by department if provided in URL
  if (department) {
    displayedPrograms = displayedPrograms.filter(p => 
      p.faculty === department || p.department === department
    );
  }
  // "full" → show all (when coming from Universities list / direct URL)

  const hasPrograms = displayedPrograms.length > 0;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Back navigation – you can make it dynamic too if desired */}
      <Button variant="ghost" className="mb-6 pl-0" asChild>
        <Link to="/student-dashboard" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      {/* University Header */}
      <Card className="border-2 mb-10">
        <CardHeader>
          <CardTitle className="text-3xl mb-2">{university.universityName || university.institutionName}</CardTitle>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-base text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {university.address}
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              Rating: <span className="font-medium">{university.rating}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Programs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <GraduationCap className="h-6 w-6" />
          {viewMode === "eligible" 
            ? "Eligible Programs" 
            : viewMode === "ineligible" 
              ? "Programs (Not Eligible)" 
              : "Available Programs"}
        </h2>

        {hasPrograms ? (
          <div className="grid md:grid-cols-2 gap-6">
            {displayedPrograms.map((program) => (
              <Card key={program._id} className="border-2 h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-xl">{program.name || program.programName}</CardTitle>

                    {viewMode === "full" ? (
                      // Only show eligibility badge when showing all programs
                      program.isEligible ? (
                        <Badge className="bg-green-600 hover:bg-green-700 shrink-0">
                          <CheckCircle className="h-3 w-3 mr-1" /> Eligible
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="shrink-0">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Not Eligible
                        </Badge>
                      )
                    ) : viewMode === "eligible" ? (
                      <Badge className="bg-green-600 hover:bg-green-700 shrink-0">
                        <CheckCircle className="h-3 w-3 mr-1" /> Eligible
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="shrink-0">
                        <AlertTriangle className="h-3 w-3 mr-1" /> Not Eligible
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-1.5">
                    {program.level} • {program.duration} years
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between pt-2">
                  <div className="space-y-3">
                    <p className="text-sm">
                      <span className="font-medium">Fee per semester:</span>{" "}
                      {program.feePerSemester}
                    </p>
                    {program.description && (
                      <p className="text-sm text-muted-foreground">
                        {program.description}
                      </p>
                    )}
                  </div>

                  {/* Show reason only in ineligible mode or when showing all */}
                  {!program.isEligible && program.ineligibilityReason && (
                    (viewMode === "ineligible" || viewMode === "full") && (
                      <div className="mt-4 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>Reason: {program.ineligibilityReason}</span>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              {viewMode === "eligible"
                ? "No eligible programs found for this university based on your profile."
                : viewMode === "ineligible"
                  ? "No ineligible programs listed in this context."
                  : "No programs listed for this university at the moment."}
            </CardContent>
          </Card>
        )}
      </section>

      {/* Admission Website – only show if there's at least one eligible program visible */}
      {(viewMode === "eligible" || 
        (viewMode === "full" && university.programs?.some(p => p.isEligible))) && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Admission & Application</h2>
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="text-center sm:text-left space-y-6">
                <p className="text-lg text-muted-foreground">
                  To apply for admission or get the most up-to-date application information,
                  please visit the university's official admission portal:
                </p>

                {university.website || university.admissionWebsite ? (
                  <Button size="lg" className="gap-2" asChild>
                    <a
                      href={university.admissionWebsite || university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Go to Admission Website
                    </a>
                  </Button>
                ) : (
                  <div className="text-muted-foreground">
                    No official admission website link provided.
                  </div>
                )}

                <div className="text-sm text-muted-foreground mt-8">
                  Note: Always verify deadlines, requirements and fees directly on the
                  university's official website.
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
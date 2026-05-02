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
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Building2, GraduationCap, Calendar, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function MeritList() {
  const [meritLists, setMeritLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const location = useLocation();

  useEffect(() => {
    const fetchMeritLists = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const universityId = params.get("universityId");
        if (!universityId) {
          throw new Error("University ID is required to load merit lists.");
        }

        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/student/merit-lists?universityId=${encodeURIComponent(universityId)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMeritLists(res.data.data?.programs || []);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to load merit lists.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMeritLists();
  }, [location.search, toast]);

  if (loading) {
    return <div className="text-center py-12">Loading Merit Lists...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Back Button */}
      <Link to="/student-dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Official Merit Lists
          </h1>
          <p className="text-muted-foreground mt-2">
            Latest merit lists uploaded by universities in Punjab
          </p>
        </div>
      </div>

      {meritLists.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">No Merit Lists Available Yet</h3>
            <p className="text-muted-foreground mt-2">
              Universities haven't uploaded any official merit lists.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meritLists.map((item) => (
            <Card key={item._id} className="border-2 hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {item.programName || item.program?.programName}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <Building2 className="inline h-4 w-4 mr-1" />
                      {item.universityName || item.university?.universityName}
                    </CardDescription>
                  </div>

                  {item.meritRange && (
                    <Badge variant="secondary">
                      {item.meritRange.minMerit}% — {item.meritRange.maxMerit}%
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  {item.level} • {item.duration} years
                </div>

                {item.cycle && item.year && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {item.cycle} {item.year}
                  </div>
                )}

                {item.description && (
                  <div>
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Merit List PDF Button */}
                {item.meritsListUrl ? (
                  <a
                    href={item.meritsListUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Download className="h-4 w-4" />
                    View / Download Merit List
                  </a>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Merit List Not Uploaded
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
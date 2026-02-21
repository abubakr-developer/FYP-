import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Users, BookOpen, Star, AlertCircle, Loader2, ExternalLink } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Universities() {
  const navigate = useNavigate();

  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/student/universities`);

        if (!res.ok) {
          throw new Error("Failed to load universities");
        }

        const data = await res.json();
        const uniList = data.success ? data.universities || data.data || [] : [];

        setUniversities(uniList);
      } catch (err) {
        console.error("Universities fetch error:", err);
        setError("Could not load universities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Extract unique cities & types for filters (you can make this dynamic later)
  const cities = ["all", "Lahore", "Faisalabad", "Multan", "Rawalpindi", "Gujranwala", "Sialkot", "Gujrat", "Bahawalpur", "Sargodha"];
  const types = ["all", "Public", "Private"];

  // Apply filters
  const filteredUniversities = universities.filter((uni) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (uni.institutionName || "").toLowerCase().includes(searchLower) ||
      (uni.city || "").toLowerCase().includes(searchLower) ||
      (uni.address || "").toLowerCase().includes(searchLower);

    const matchesCity =
      cityFilter === "all" ||
      (uni.city || "").toLowerCase() === cityFilter.toLowerCase() ||
      (uni.address || "").toLowerCase().includes(cityFilter.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      (uni.institutionType || "").toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesCity && matchesType;
  });

  const handleViewDetails = (uni) => {
    // You can pass university ID or slug if your details page supports it
    // For now going to student login as per your original code
    navigate("/studentlogin");
    // Alternative: navigate(`/university/${uni._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading universities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero + Filters */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Explore <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Universities</span>
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-8">
            Discover {universities.length} approved universities across Punjab
          </p>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city === "all" ? "All Cities" : city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "all" ? "All Types" : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Universities Grid */}
      <section className="py-12 px-4 flex-1">
        <div className="container max-w-6xl mx-auto">
          {filteredUniversities.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl font-medium text-muted-foreground">
                No universities found matching your search.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSearchQuery("");
                  setCityFilter("all");
                  setTypeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUniversities.map((uni) => (
                <Card
                  key={uni._id}
                  className="border-2 hover:shadow-xl transition-all hover:scale-[1.02] duration-300 flex flex-col h-full min-h-[320px]"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-1">
                          {uni.institutionName || "Unnamed University"}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {uni.address || uni.city || "N/A"}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={uni.institutionType?.toLowerCase() === "public" ? "default" : "secondary"}
                      >
                        {uni.institutionType
                          ? uni.institutionType.charAt(0).toUpperCase() + uni.institutionType.slice(1)
                          : "Unknown"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 mt-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{uni.rating || 0}/5</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1 space-y-4 p-6 pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-4 flex-1">
                      {uni.description || "No description available."}
                    </p>

                    <div className="grid grid-cols-2 gap-4 py-4 border-t">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">{uni.programs?.length || 0}</p>
                          <p className="text-xs text-muted-foreground">Programs</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">—</p>
                          <p className="text-xs text-muted-foreground">Students</p>
                        </div>
                      </div>
                    </div>

                    {/* View Details button fixed at bottom */}
                    <div className="mt-auto pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(uni)}
                        className="w-full gap-2"
                      >
                        View Details
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
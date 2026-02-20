import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Calendar, MapPin, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Events() {
  const { toast } = useToast();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
       const res = await fetch(`${API_URL}/api/student/public/events`);

        if (!res.ok) {
          throw new Error(`Failed to load events: ${res.status}`);
        }

        const data = await res.json();
        const eventList = data.success ? data.events || [] : [];

        setEvents(eventList);
      } catch (err) {
        console.error("Events fetch error:", err);
        setError("Could not load events. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load university events",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply search filter
  const filteredEvents = events.filter(event => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (event.title || "").toLowerCase().includes(searchLower) ||
      (event.universityName || "").toLowerCase().includes(searchLower) ||
      (event.description || "").toLowerCase().includes(searchLower) ||
      (event.location || "").toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading university events...</p>
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

      {/* Hero + Search */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            University <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Events</span>
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-8">
            Stay updated with {events.length} real events from approved universities
          </p>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events by title, university or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 px-4 flex-1">
        <div className="container max-w-6xl mx-auto">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl font-medium text-muted-foreground">
                {searchQuery 
                  ? "No events found matching your search."
                  : "No upcoming events from approved universities at the moment."}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card 
                  key={event._id || event.id} 
                  className="border-2 hover:shadow-xl transition-all hover:scale-[1.02] duration-300"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                          <CardDescription className="text-base font-medium mt-1">
                            {event.universityName}
                          </CardDescription>
                        </div>
                      </div>

                      <Badge variant="outline">{event.type || "Event"}</Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {event.date 
                          ? new Date(event.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : "Date not specified"}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {event.description || "No description available."}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location || "Location not specified"}</span>
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
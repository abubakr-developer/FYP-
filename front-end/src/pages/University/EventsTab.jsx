import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { eventSchema, validateForm } from "@/lib/validation";

export default function EventsTab({ apiFetch }) {
  const { toast } = useToast();

  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });

  const [eventFile, setEventFile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await apiFetch("/events");
      console.log("Events fetched from backend:", response);

      // Handle different possible response shapes from your backend
      let eventList = [];

      // Most common shape: { success: true, events: [...] }
      if (response?.events && Array.isArray(response.events)) {
        eventList = response.events;
      }
      // Alternative shape: { success: true, data: { events: [...] } }
      else if (response?.data?.events && Array.isArray(response.data.events)) {
        eventList = response.data.events;
      }
      // Direct array (less common)
      else if (Array.isArray(response?.data)) {
        eventList = response.data;
      } else if (Array.isArray(response)) {
        eventList = response;
      } else {
        console.warn("Could not extract events array from response:", response);
      }

      setEvents(eventList);

    } catch (err) {
      console.error("Failed to load events:", err);
      toast({
        title: "Error",
        description: err.message || "Could not load your events. Please try again.",
        variant: "destructive",
      });
      setEvents([]); // Clear list on error to avoid confusion
    } finally {
      setLoadingEvents(false);
    }
  };

  const renderError = (field) => {
    if (!errors[field]) return null;
    return (
      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
        <AlertCircle className="h-3 w-3" />
        {errors[field]}
      </p>
    );
  };

  const handleAddEvent = async () => {
    const result = validateForm(eventSchema, eventData);
    if (!result.success) {
      setErrors(result.errors || {});
      toast({
        title: "Validation Error",
        description: "Please fix the errors",
        variant: "destructive",
      });
      return;
    }

    if (!eventFile) {
      toast({
        title: "Missing file",
        description: "Please select a poster/image",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("date", eventData.date);
      formData.append("location", eventData.location);
      formData.append("description", eventData.description);
      formData.append("image", eventFile);

      const response = await apiFetch("/events", {
        method: "POST",
        body: formData,
      });

      console.log("Add event response:", response);

      toast({
        title: "Success",
        description: response.message || "Event created successfully",
      });

      // Reset form
      setEventData({
        title: "",
        date: "",
        location: "",
        description: "",
      });
      setEventFile(null);
      setErrors({});

      // Give backend a moment to save → then refresh list
      await new Promise((resolve) => setTimeout(resolve, 500));
      await loadEvents();

    } catch (err) {
      console.error("Create event failed:", err);
      toast({
        title: "Failed to create event",
        description: err.message || "Server error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ────────────────────────────────────────────────
          CREATE EVENT FORM
      ──────────────────────────────────────────────── */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Event Title</Label>
            <Input
              placeholder="Event title"
              value={eventData.title}
              onChange={(e) => setEventData((p) => ({ ...p, title: e.target.value }))}
              className={errors.title && "border-destructive"}
            />
            {renderError("title")}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData((p) => ({ ...p, date: e.target.value }))}
                className={errors.date && "border-destructive"}
              />
              {renderError("date")}
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Location"
                value={eventData.location}
                onChange={(e) => setEventData((p) => ({ ...p, location: e.target.value }))}
                className={errors.location && "border-destructive"}
              />
              {renderError("location")}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Event details, agenda, speakers, registration info..."
              rows={4}
              value={eventData.description}
              onChange={(e) => setEventData((p) => ({ ...p, description: e.target.value }))}
              className={errors.description && "border-destructive"}
            />
            {renderError("description")}
          </div>

          <div className="space-y-2">
            <Label>Poster / Banner</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setEventFile(e.target.files?.[0] || null)}
            />
          </div>

          <Button
            onClick={handleAddEvent}
            className="w-full"
            disabled={isSubmitting || loadingEvents}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ────────────────────────────────────────────────
          YOUR EVENTS LIST
      ──────────────────────────────────────────────── */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Your Events</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingEvents ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No events created yet.</p>
              <p className="mt-2">Create your first event above!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card
                  key={event._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0">
                    {event.posterUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.posterUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder-event.jpg"; // Add this file to public/
                            e.target.alt = "Poster not available";
                          }}
                        />
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      <h3 className="font-semibold text-xl line-clamp-2">
                        {event.title}
                      </h3>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium block">Date</span>
                          {event.date
                            ? new Date(event.date).toLocaleDateString("en-PK", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </div>

                        <div>
                          <span className="font-medium block">Location</span>
                          {event.location || "Not specified"}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description || "No description provided."}
                      </p>

                      <div className="flex gap-3 pt-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
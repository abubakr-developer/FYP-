import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { eventSchema, validateForm } from "@/lib/validation";
import { apiFetch } from "@/lib/utils";

export default function EventsTab() {
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
      const data = response.data || [];
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to load events",
        variant: "destructive",
      });
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
      formData.append("image", eventFile); // Changed to 'image' to match Multer

      await apiFetch("/events", { method: "POST", body: formData });

      toast({ title: "Success", description: "Event created successfully" });
      setEventData({ title: "", date: "", location: "", description: "" });
      setEventFile(null);
      setErrors({});
      loadEvents();
    } catch (err) {
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
              onChange={(e) =>
                setEventData((p) => ({ ...p, title: e.target.value }))
              }
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
                onChange={(e) =>
                  setEventData((p) => ({ ...p, date: e.target.value }))
                }
                className={errors.date && "border-destructive"}
              />
              {renderError("date")}
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Location"
                value={eventData.location}
                onChange={(e) =>
                  setEventData((p) => ({ ...p, location: e.target.value }))
                }
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
              onChange={(e) =>
                setEventData((p) => ({ ...p, description: e.target.value }))
              }
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

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Your Events</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingEvents ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No events created yet.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <Card key={e._id}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold">{e.title}</h3>
                    <p className="text-sm">
                      Date:{" "}
                      {e.date ? new Date(e.date).toLocaleDateString() : "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Location: {e.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Description: {e.description}
                    </p>
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

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, Trash2, Pencil, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { scholarshipSchema, validateForm } from "@/lib/validation";

export default function ScholarshipsTab({ apiFetch }) {
  const { toast } = useToast();

  const [scholarshipData, setScholarshipData] = useState({
    name: "",
    percentage: "",
    deadline: "",
    description: "",
    eligibility: "",
  });

  const [scholarships, setScholarships] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loadingScholarships, setLoadingScholarships] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    setLoadingScholarships(true);
    try {
      const data = await apiFetch("/scholarships");
      setScholarships(Array.isArray(data) ? data : data.scholarships || data.data || []);
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoadingScholarships(false);
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

  const handleSubmit = async () => {
    const parsed = {
      ...scholarshipData,
      percentage: scholarshipData.percentage ? parseFloat(scholarshipData.percentage) : 0,
    };

    const result = validateForm(scholarshipSchema, parsed);
    if (!result.success) {
      setErrors(result.errors || {});
      toast({ title: "Validation Error", description: "Please fix the errors", variant: "destructive" });
      return;
    }

    try {
      await apiFetch(editingId ? `/scholarships/${editingId}` : "/scholarships", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      toast({ title: "Success", description: `Scholarship ${editingId ? "updated" : "added"} successfully` });
      setScholarshipData({ name: "", percentage: "", deadline: "", description: "", eligibility: "" });
      setErrors({});
      loadScholarships();
    } catch (err) {
      toast({
        title: "Failed to add scholarship",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setEditingId(null);
    }
  };

  const handleEdit = (scholarship) => {
    setScholarshipData({
      name: scholarship.name,
      percentage: scholarship.percentage?.toString() || "",
      deadline: scholarship.deadline ? new Date(scholarship.deadline).toISOString().split('T')[0] : "",
      description: scholarship.description || "",
      eligibility: scholarship.eligibility || "",
    });
    setEditingId(scholarship._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) return;
    try {
      await apiFetch(`/scholarships/${id}`, { method: "DELETE" });
      toast({ title: "Success", description: "Scholarship deleted successfully" });
      loadScholarships();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleCancelEdit = () => {
    setScholarshipData({ name: "", percentage: "", deadline: "", description: "", eligibility: "" });
    setEditingId(null);
    setErrors({});
  };

  return (
    <div className="space-y-8">
      {/* Form Card - unchanged */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {editingId ? "Edit Scholarship" : "Add Scholarship"}
            {editingId && (
              <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Scholarship name"
              value={scholarshipData.name}
              onChange={(e) => setScholarshipData((p) => ({ ...p, name: e.target.value }))}
              className={errors.name && "border-destructive"}
            />
            {renderError("name")}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Percentage (%)</Label>
              <Input
                type="number"
                placeholder="e.g. 50"
                value={scholarshipData.percentage}
                onChange={(e) => setScholarshipData((p) => ({ ...p, percentage: e.target.value }))}
                className={errors.percentage && "border-destructive"}
              />
              {renderError("percentage")}
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input
                type="date"
                value={scholarshipData.deadline}
                onChange={(e) => setScholarshipData((p) => ({ ...p, deadline: e.target.value }))}
                className={errors.deadline && "border-destructive"}
              />
              {renderError("deadline")}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description / Benefits</Label>
            <Textarea
              placeholder="Describe benefits, application process, etc..."
              rows={4}
              value={scholarshipData.description}
              onChange={(e) => setScholarshipData((p) => ({ ...p, description: e.target.value }))}
              className={errors.description && "border-destructive"}
            />
            {renderError("description")}
          </div>

          <div className="space-y-2">
            <Label>Eligibility</Label>
            <Textarea
              placeholder="Eligibility requirements..."
              rows={4}
              value={scholarshipData.eligibility}
              onChange={(e) => setScholarshipData((p) => ({ ...p, eligibility: e.target.value }))}
              className={errors.eligibility && "border-destructive"}
            />
            {renderError("eligibility")}
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={loadingScholarships}>
            {loadingScholarships ? "Processing..." : editingId ? "Update Scholarship" : "Add Scholarship"}
          </Button>
        </CardContent>
      </Card>

      {/* Scholarships List */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Your Scholarships</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingScholarships ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : scholarships.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No scholarships added yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {scholarships.map((s) => (
                <Card
                  key={s._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full min-h-[260px]"
                >
                  <CardContent className="p-6 flex flex-col flex-1 space-y-4">
                    <h3 className="font-semibold text-xl line-clamp-2">{s.name}</h3>

                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Percentage:</span>{" "}
                        {s.percentage ? `${s.percentage}%` : "—"}
                      </p>
                      <p>
                        <span className="font-medium">Deadline:</span>{" "}
                        {s.deadline ? new Date(s.deadline).toLocaleDateString("en-PK") : "—"}
                      </p>
                    </div>

                    <div className="space-y-2 flex-1">
                      <p className="text-sm">
                        <span className="font-medium block">Description:</span>
                        <span className="text-muted-foreground line-clamp-3">
                          {s.description || "No description provided."}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium block">Eligibility:</span>
                        <span className="text-muted-foreground line-clamp-3">
                          {s.eligibility || "No eligibility criteria specified."}
                        </span>
                      </p>
                    </div>

                    {/* Buttons fixed at bottom */}
                    <div className="mt-auto pt-4 border-t">
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1.5"
                          onClick={() => handleEdit(s)}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 gap-1.5"
                          onClick={() => handleDelete(s._id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, Trash2, Edit, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { scholarshipSchema, validateForm } from "@/lib/validation"; 

export default function ScholarshipsTab({ apiFetch }) {
  const { toast } = useToast();
  const [scholarshipData, setScholarshipData] = useState({
    name: "",
    amount: "",
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
      amount: scholarshipData.amount ? parseFloat(scholarshipData.amount) : 0,
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
        body: JSON.stringify(parsed),
      });

      toast({ title: "Success", description: `Scholarship ${editingId ? "updated" : "added"} successfully` });
      setScholarshipData({ name: "", amount: "", deadline: "", description: "", eligibility: "" });
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
      amount: scholarship.amount,
      deadline: scholarship.deadline ? new Date(scholarship.deadline).toISOString().split('T')[0] : "",
      description: scholarship.description,
      eligibility: scholarship.eligibility,
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
    setScholarshipData({ name: "", amount: "", deadline: "", description: "", eligibility: "" });
    setEditingId(null);
    setErrors({});
  };

  return (
    <div className="space-y-8">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {editingId ? "Edit Scholarship" : "Add Scholarship"}
            {editingId && <Button variant="ghost" size="sm" onClick={handleCancelEdit}><X className="h-4 w-4 mr-2" /> Cancel</Button>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Scholarship name"
              value={scholarshipData.name}
              onChange={e => setScholarshipData(p => ({ ...p, name: e.target.value }))}
              className={errors.name && "border-destructive"}
            />
            {renderError("name")}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Amount (PKR)</Label>
              <Input
                type="number"
                placeholder="Amount"
                value={scholarshipData.amount}
                onChange={e => setScholarshipData(p => ({ ...p, amount: e.target.value }))}
                className={errors.amount && "border-destructive"}
              />
              {renderError("amount")}
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input
                type="date"
                value={scholarshipData.deadline}
                onChange={e => setScholarshipData(p => ({ ...p, deadline: e.target.value }))}
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
              onChange={e => setScholarshipData(p => ({ ...p, description: e.target.value }))}
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
              onChange={e => setScholarshipData(p => ({ ...p, eligibility: e.target.value }))}
              className={errors.eligibility && "border-destructive"}
            />
            {renderError("eligibility")}
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={loadingScholarships}>
            {loadingScholarships ? "Processing..." : (editingId ? "Update Scholarship" : "Add Scholarship")}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader><CardTitle>Your Scholarships</CardTitle></CardHeader>
        <CardContent>
          {loadingScholarships ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : scholarships.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No scholarships added yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {scholarships.map(s => (
                <Card key={s._id}>
                  <CardContent className="pt-6 relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(s)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(s._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <h3 className="font-semibold">{s.name}</h3>
                    <p className="text-sm">PKR {s.amount?.toLocaleString() || "—"}</p>
                    <p className="text-sm text-muted-foreground">Deadline: {s.deadline ? new Date(s.deadline).toLocaleDateString() : "—"}</p>
                    <p className="text-sm text-muted-foreground">Description: {s.description}</p>
                    <p className="text-sm text-muted-foreground">Eligibility: {s.eligibility}</p>
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
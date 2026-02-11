import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { programSchema, validateForm } from "@/lib/validation";
import { apiFetch } from "@/lib/utils";

export default function ProgramsTab() {
  const { toast } = useToast();
  const [programData, setProgramData] = useState({
    programName: "",
    duration: "",
    eligibilityCriteria: "",
    fee: "",
    seats: "",
  });
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoadingPrograms(true);
    try {
      const data = await apiFetch("/programs");
      setPrograms(Array.isArray(data) ? data : data.programs || data.data || []);
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoadingPrograms(false);
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

  const handleAddProgram = async () => {
    const parsed = {
      ...programData,
      fee: programData.fee ? parseFloat(programData.fee) : undefined,
      seats: programData.seats ? parseInt(programData.seats) : undefined,
    };
    const result = validateForm(programSchema, parsed);
    if (!result.success) {
      setErrors(result.errors || {});
      toast({ title: "Validation Error", description: "Please fix the errors", variant: "destructive" });
      return;
    }

    try {
      await apiFetch("/programs", {
        method: "POST",
        body: JSON.stringify(parsed),
      });
      toast({ title: "Success", description: "Program added successfully" });
      setProgramData({ programName: "", duration: "", eligibilityCriteria: "", fee: "", seats: "" });
      setErrors({});
      loadPrograms();
    } catch (err) {
      toast({
        title: "Failed to add program",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-2">
        <CardHeader><CardTitle>Add Program</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Program Name</Label>
              <Input
                placeholder="e.g. Bachelor of Science in Computer Science"
                value={programData.programName}
                onChange={e => setProgramData(p => ({ ...p, programName: e.target.value }))}
                className={errors.programName && "border-destructive"}
              />
              {renderError("programName")}
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                placeholder="e.g. 4 Years"
                value={programData.duration}
                onChange={e => setProgramData(p => ({ ...p, duration: e.target.value }))}
                className={errors.duration && "border-destructive"}
              />
              {renderError("duration")}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Eligibility Criteria</Label>
            <Textarea
              placeholder="e.g. Intermediate (Pre-Engineering) with minimum 60% marks, entry test required..."
              rows={4}
              value={programData.eligibilityCriteria}
              onChange={e => setProgramData(p => ({ ...p, eligibilityCriteria: e.target.value }))}
              className={errors.eligibilityCriteria && "border-destructive"}
            />
            {renderError("eligibilityCriteria")}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Fee (optional)</Label>
              <Input
                type="number"
                placeholder="e.g. 500000"
                value={programData.fee}
                onChange={e => setProgramData(p => ({ ...p, fee: e.target.value }))}
                className={errors.fee && "border-destructive"}
              />
              {renderError("fee")}
            </div>
            <div className="space-y-2">
              <Label>Seats (optional)</Label>
              <Input
                type="number"
                placeholder="e.g. 100"
                value={programData.seats}
                onChange={e => setProgramData(p => ({ ...p, seats: e.target.value }))}
                className={errors.seats && "border-destructive"}
              />
              {renderError("seats")}
            </div>
          </div>

          <Button onClick={handleAddProgram} className="w-full" disabled={loadingPrograms}>
            {loadingPrograms ? "Adding..." : "Add Program"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader><CardTitle>Your Programs</CardTitle></CardHeader>
        <CardContent>
          {loadingPrograms ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : programs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No programs added yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {programs.map(p => (
                <Card key={p._id}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold">{p.programName}</h3>
                    <p className="text-sm text-muted-foreground">Duration: {p.duration}</p>
                    <p className="text-sm text-muted-foreground">Eligibility: {p.eligibilityCriteria}</p>
                    <p className="text-sm text-muted-foreground">Fee: PKR {p.fee?.toLocaleString() || "0"}</p>
                    <p className="text-sm text-muted-foreground">Seats: {p.seats || "0"}</p>
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
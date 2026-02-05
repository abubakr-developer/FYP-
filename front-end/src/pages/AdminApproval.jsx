import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Define API base URL (consistent with your other pages)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminApprovals() {
  const { toast } = useToast();
  const [pendingUniversities, setPendingUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingIds, setApprovingIds] = useState(new Set()); // Track approving states per ID

  useEffect(() => {
    fetchPendingUniversities();
  }, []);

  const fetchPendingUniversities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/university/pending`);
      setPendingUniversities(response.data || []);
    } catch (error) {
      console.error("Error fetching pending universities:", error);
      toast({
        title: "Error",
        description: "Failed to load pending registrations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setApprovingIds((prev) => new Set([...prev, id]));
    try {
      const response = await axios.post(`${API_URL}/api/university/approve/${id}`);
      toast({
        title: "Approved",
        description: response.data.message || "University approved successfully. Notification sent.",
      });
      // Refresh the list after approval
      fetchPendingUniversities();
    } catch (error) {
      console.error("Approval error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve. Please try again.",
        variant: "destructive",
      });
    } finally {
      setApprovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Approvals</h1>
          </div>
          <Button variant="outline" onClick={fetchPendingUniversities}>
            Refresh List
          </Button>
        </div>

        {/* Pending List */}
        {pendingUniversities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                No pending university registrations.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Pending University Registrations</CardTitle>
              <CardDescription>
                Review and approve new institutions. Approval will send an email notification and enable login.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Institution Name</TableHead>
                    <TableHead>Official Email</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUniversities.map((uni) => (
                    <TableRow key={uni.id}>
                      <TableCell className="font-medium">{uni.institutionName}</TableCell>
                      <TableCell>{uni.officialEmail}</TableCell>
                      <TableCell>{uni.contactPerson}</TableCell>
                      <TableCell>{uni.phone}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(uni.id)}
                          disabled={approvingIds.has(uni.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {approvingIds.has(uni.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
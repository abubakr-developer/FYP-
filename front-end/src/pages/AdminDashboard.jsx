import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Users, Building2, CheckCircle, XCircle, TrendingUp, Info, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [pendingUniversities, setPendingUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingIds, setApprovingIds] = useState(new Set()); // Track per-university loading
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    fetchPendingUniversities();
  }, []);

  const fetchPendingUniversities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/superadmin/universities/pending`, { withCredentials: true });
      setPendingUniversities(response.data || []);
      setAuthError(null);
    } catch (error) {
      console.error("Error fetching pending universities:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setAuthError("You are not signed in as a Super Admin. Please sign in to continue.");
      } else {
        toast({
          title: "Error",
          description: "Failed to load pending approvals. Please try again.",
          variant: "destructive",
        });
      }
      setPendingUniversities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (universityId) => {
    setApprovingIds((prev) => new Set([...prev, universityId]));
    try {
      const response = await axios.post(`${API_URL}/api/superadmin/universities/approve/${universityId}`, null, { withCredentials: true });
      toast({
        title: "Success",
        description: response.data.message || "University approved successfully!",
      });
      // Refresh list
      fetchPendingUniversities();
    } catch (error) {
      console.error("Approval error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve university.",
        variant: "destructive",
      });
    } finally {
      setApprovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(universityId);
        return newSet;
      });
    }
  };

  // Optional: Handle Reject (add backend endpoint if you want)
  const handleReject = async (universityId) => {
    const reason = window.prompt('Please enter a reason for rejection (optional):');
    try {
      const response = await axios.post(`${API_URL}/api/superadmin/universities/reject/${universityId}`, { reason }, { withCredentials: true });
      toast({
        title: "Rejected",
        description: response.data.message || "University rejected",
      });
      fetchPendingUniversities();
    } catch (error) {
      console.error('Reject error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reject university',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, null, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate('/admin-login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-8 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground">System management and oversight</p>
        </div>
      </section>
      <section className="py-8 px-4 flex-1">
        <div className="container max-w-6xl mx-auto">
          <Alert className="mb-6 border-amber-500/20 bg-amber-500/5">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode:</strong> Statistics are sample. Approvals now use real backend data (pending universities).
            </AlertDescription>
          </Alert>

          {authError && (
            <Alert className="mb-6 border-red-500/20 bg-red-500/5">
              <Info className="h-4 w-4" />
              <AlertDescription>
                {authError}
                <div className="mt-4 flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => fetchPendingUniversities()}>
                    Retry
                  </Button>
                  <Button onClick={() => navigate('/admin-login')}>Sign In</Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Keep your other cards (students, universities, etc.) as demo */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Total Users (Demo)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">15,234</span>
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Universities (Demo)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">102</span>
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{pendingUniversities.length}</span>
                  <Shield className="h-5 w-5 text-amber-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">System Health (Demo)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">98%</span>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="approvals" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="universities">Universities</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Keep other tabs as demo */}
            <TabsContent value="students">
              {/* Your demo students table */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Manage Students (Demo Data)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Your sample rows */}
                      <TableRow>
                        <TableCell>Ali Ahmed</TableCell>
                        <TableCell>ali@example.com</TableCell>
                        <TableCell><Badge>Active</Badge></TableCell>
                        <TableCell><Button variant="outline" size="sm">View</Button></TableCell>
                      </TableRow>
                      {/* ... */}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="universities">
              {/* Your demo universities table */}
            </TabsContent>

            <TabsContent value="approvals">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Pending University Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : pendingUniversities.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-lg font-medium text-muted-foreground">
                        No pending university registrations at this time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {pendingUniversities.map((uni) => (
                        <div key={uni._id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">{uni.institutionName}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Type: {uni.institutionType.charAt(0).toUpperCase() + uni.institutionType.slice(1)}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Contact: {uni.contactPerson} ({uni.officialEmail})
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Phone: {uni.phone}
                              </p>
                            </div>
                            <Badge variant="outline">Pending</Badge>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(uni._id)}
                              disabled={approvingIds.has(uni._id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {approvingIds.has(uni._id) ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(uni._id)}
                              disabled={approvingIds.has(uni._id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              {/* Your demo analytics */}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
}
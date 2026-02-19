import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, XCircle, Trash2, Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [pendingUniversities, setPendingUniversities] = useState([]);
  const [students, setStudents] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingIds, setApprovingIds] = useState(new Set());
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [authError, setAuthError] = useState(null);
  const [activeTab, setActiveTab] = useState("students");

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    withCredentials: true,
  });

  useEffect(() => {
      fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const config = getAuthConfig();
      const [pendingRes, studentsRes, unisRes] = await Promise.all([
        axios.get(`${API_URL}/api/superadmin/universities/pending`, config),
        axios.get(`${API_URL}/api/superadmin/students`, config),
        axios.get(`${API_URL}/api/superadmin/universities/all`, config),
      ]);

      setPendingUniversities(pendingRes.data || []);
      setStudents(studentsRes.data || []);
      setUniversities(unisRes.data || []);

      setAuthError(null);
    } catch (error) {
      console.error("Dashboard data error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setAuthError("You are not signed in as Super Admin. Please sign in.");
        navigate("/admin-login");
      } else {
        toast({ title: "Error", description: "Failed to load data.", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setApprovingIds((prev) => new Set([...prev, id]));
    try {
      await axios.post(`${API_URL}/api/superadmin/universities/approve/${id}`, {}, getAuthConfig());
      toast({ title: "Success", description: "University approved" });
      fetchAllData();
    } catch (err) {
      toast({ title: "Error", description: "Approval failed", variant: "destructive" });
    } finally {
      setApprovingIds((prev) => new Set([...prev].filter(x => x !== id)));
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection (optional):");
    if (reason === null) return;

    try {
      await axios.post(`${API_URL}/api/superadmin/universities/reject/${id}`, { reason }, getAuthConfig());
      toast({ title: "Rejected", description: "University rejected" });
      fetchAllData();
    } catch (err) {
      toast({ title: "Error", description: "Rejection failed", variant: "destructive" });
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to remove this ${type}? This cannot be undone.`)) return;

    setDeletingIds((prev) => new Set([...prev, id]));
    try {
      const endpoint = type === 'university' ? 'universities' : `${type}s`;
      await axios.delete(`${API_URL}/api/superadmin/${endpoint}/${id}`, getAuthConfig());
      toast({ title: "Removed", description: `${type === 'student' ? 'Student' : 'University'} removed successfully` });
      fetchAllData();
    } catch (err) {
      toast({ title: "Error", description: `Failed to remove ${type}`, variant: "destructive" });
    } finally {
      setDeletingIds((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  };

  const handleUpdateRating = async (uniId, newRating) => {
    if (newRating < 0 || newRating > 5) return;
    try {
      await axios.put(`${API_URL}/api/superadmin/universities/${uniId}`, { rating: newRating }, getAuthConfig());
      toast({ title: "Rating Updated", description: `University rating set to ${newRating} stars` });
      fetchAllData();
    } catch (err) {
      toast({ title: "Error", description: "Failed to update rating", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <section className="py-8 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Super Admin Dashboard
          </h1>
        </div>
      </section>

      <section className="py-8 px-4 flex-1">
        <div className="container max-w-6xl mx-auto">
          {authError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="universities">Universities</TabsTrigger>
              <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
            </TabsList>

            {/* STUDENTS TAB */}
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Students</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin mr-2" />
                      Loading students...
                    </div>
                  ) : students.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No students registered yet.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Field of Interest</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student._id}>
                            <TableCell>{student.firstName} {student.lastName}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.intermediatePercentage || '-'}</TableCell>
                            <TableCell>{student.fieldOfInterest || '-'}</TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete('student', student._id)}
                                disabled={deletingIds.has(student._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* UNIVERSITIES TAB */}
            <TabsContent value="universities">
              <Card>
                <CardHeader>
                  <CardTitle>All Approved Universities</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin mr-2" />
                      Loading universities...
                    </div>
                  ) : universities.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No approved universities yet.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Current Rating</TableHead>
                          <TableHead>Set Rating</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {universities.map((uni) => (
                          <TableRow key={uni._id}>
                            <TableCell>{uni.institutionName}</TableCell>
                            <TableCell>{uni.officialEmail}</TableCell>
                            <TableCell>{uni.address || '-'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                {uni.rating || 0}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {[1,2,3,4,5].map((r) => (
                                  <Button
                                    key={r}
                                    variant={uni.rating === r ? "default" : "outline"}
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleUpdateRating(uni._id, r)}
                                  >
                                    {r}
                                  </Button>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete('university', uni._id)}
                                disabled={deletingIds.has(uni._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* APPROVALS TAB */}
            <TabsContent value="approvals">
              <Card>
                <CardHeader>
                  <CardTitle>Pending University Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin mr-2" />
                      Loading pending approvals...
                    </div>
                  ) : pendingUniversities.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No pending university registrations.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Institution Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Contact Person</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingUniversities.map((uni) => (
                          <TableRow key={uni._id}>
                            <TableCell>{uni.institutionName}</TableCell>
                            <TableCell>{uni.officialEmail}</TableCell>
                            <TableCell>{uni.contactPerson || '-'}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleApprove(uni._id)}
                                  disabled={approvingIds.has(uni._id)}
                                >
                                  {approvingIds.has(uni._id) ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                  )}
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleReject(uni._id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
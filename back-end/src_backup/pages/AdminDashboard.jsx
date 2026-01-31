import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Users, Building2, CheckCircle, XCircle, TrendingUp, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { toast } = useToast();
  
  const handleApproval = (type, action) => {
    toast({ 
      title: "Demo Mode", 
      description: `${type} would be ${action.toLowerCase()}. Backend required for actual approvals.` 
    });
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
              <strong>Demo Mode:</strong> All statistics shown are sample data for demonstration purposes. Enable backend authentication to view real metrics and manage actual users.
            </AlertDescription>
          </Alert>

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
                <CardTitle className="text-sm text-muted-foreground">Pending Approvals (Demo)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">7</span>
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

            <TabsContent value="students">
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
                      <TableRow>
                        <TableCell>Ali Ahmed</TableCell>
                        <TableCell>ali@example.com</TableCell>
                        <TableCell><Badge>Active</Badge></TableCell>
                        <TableCell><Button variant="outline" size="sm">View</Button></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sara Khan</TableCell>
                        <TableCell>sara@example.com</TableCell>
                        <TableCell><Badge>Active</Badge></TableCell>
                        <TableCell><Button variant="outline" size="sm">View</Button></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="universities">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Manage Universities (Demo Data)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>University of Punjab</TableCell>
                        <TableCell>Lahore</TableCell>
                        <TableCell><Badge>Public</Badge></TableCell>
                        <TableCell><Button variant="outline" size="sm">Manage</Button></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>LUMS</TableCell>
                        <TableCell>Lahore</TableCell>
                        <TableCell><Badge variant="secondary">Private</Badge></TableCell>
                        <TableCell><Button variant="outline" size="sm">Manage</Button></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approvals">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Pending Approvals (Demo Data)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">New University Registration</h4>
                        <p className="text-sm text-muted-foreground">Sialkot University - Private</p>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApproval("University", "Approved")}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleApproval("University", "Rejected")}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>System Analytics (Demo Data)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Daily Active Users</p>
                      <p className="text-2xl font-bold">4,567</p>
                      <p className="text-sm text-green-600">+15% from last week</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Searches This Month</p>
                      <p className="text-2xl font-bold">28,934</p>
                      <p className="text-sm text-green-600">+22% from last month</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Applications</p>
                      <p className="text-2xl font-bold">1,245</p>
                      <p className="text-sm text-green-600">+8% from last month</p>
                    </div>
                  </div>
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

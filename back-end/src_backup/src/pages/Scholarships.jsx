import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scholarships } from "@/data/mockData";
import { Search, DollarSign, Calendar, CheckCircle, Award } from "lucide-react";

export default function Scholarships() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholarship.universityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || scholarship.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const types = ["all", ...new Set(scholarships.map(s => s.type))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Find <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Scholarships</span>
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-8">
            Discover financial aid opportunities that match your profile
          </p>

          {/* Search and Filters */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search scholarships..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>
                        {type === "all" ? "All Types" : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Scholarships Grid */}
      <section className="py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid gap-6">
            {filteredScholarships.map(scholarship => (
              <Card key={scholarship.id} className="border-2 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-1">{scholarship.title}</CardTitle>
                        <CardDescription className="text-base">
                          {scholarship.universityName}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={
                      scholarship.type === "Merit Based" ? "default" : 
                      scholarship.type === "Need Based" ? "secondary" : 
                      "outline"
                    }>
                      {scholarship.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {scholarship.description}
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-start space-x-3">
                      <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">Award Amount</p>
                        <p className="text-sm text-muted-foreground">{scholarship.amount}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">Deadline</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(scholarship.deadline).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">Eligibility</p>
                        <p className="text-sm text-muted-foreground">{scholarship.eligibility}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button>Apply Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredScholarships.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No scholarships found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

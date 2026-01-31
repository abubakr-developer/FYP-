import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { universities, scholarships, programs, events, newsItems } from "@/data/mockData";
import { MapPin, Star, Users, BookOpen, Calendar, Award, DollarSign, Clock, ArrowLeft, ExternalLink } from "lucide-react";

export default function UniversityDetail() {
  const { id } = useParams();
  const university = universities.find(u => u.id === id);

  if (!university) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">University Not Found</h1>
            <Link to="/universities">
              <Button>Back to Universities</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const uniScholarships = scholarships.filter(s => s.universityName === university.name);
  const uniPrograms = programs.filter(p => p.id.startsWith(university.id));
  const uniEvents = events.filter(e => e.universityName === university.name);
  const uniNews = newsItems.filter(n => n.universityName === university.name);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="py-8 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container max-w-6xl mx-auto">
          <Link to="/universities">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Universities
            </Button>
          </Link>
          
          <Card className="border-2">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="text-6xl">{university.logo}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-3xl">{university.name}</CardTitle>
                      <Badge variant={university.type === "Public" ? "default" : "secondary"}>
                        {university.type}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{university.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{university.rating} Rating</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{university.students.toLocaleString()} Students</span>
                      </div>
                    </div>
                  </div>
                </div>
                {university.website && (
                  <Button asChild>
                    <a href={university.website} target="_blank" rel="noopener noreferrer">
                      Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">{university.description}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Admission Criteria</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Minimum Percentage Required</p>
                      <p className="text-2xl font-bold text-primary">{university.minPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Programs Offered</p>
                      <p className="text-2xl font-bold">{university.programs}+</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Enrolled Students</p>
                      <p className="text-2xl font-bold">{university.students.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Quick Facts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Type</span>
                      <Badge variant={university.type === "Public" ? "default" : "secondary"}>
                        {university.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-semibold">{university.city}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-semibold flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {university.rating}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Active Scholarships</span>
                      <span className="font-semibold">{uniScholarships.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>About {university.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {university.description} The university is committed to providing quality education and fostering innovation. 
                    With state-of-the-art facilities and experienced faculty, we prepare students for successful careers in their chosen fields.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="programs" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {uniPrograms.length > 0 ? (
                  uniPrograms.map(program => (
                    <Card key={program.id} className="border-2">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{program.name}</span>
                          <Badge>{program.degree}</Badge>
                        </CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-4 w-4" />
                            <span>{program.duration}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Fee per Semester</span>
                          <span className="font-semibold">{program.fee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Available Seats</span>
                          <span className="font-semibold">{program.seats}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Min. Percentage</span>
                          <span className="font-semibold text-primary">{program.minPercentage}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    Program information will be updated soon.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="scholarships" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {uniScholarships.length > 0 ? (
                  uniScholarships.map(scholarship => (
                    <Card key={scholarship.id} className="border-2">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle>{scholarship.title}</CardTitle>
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold text-primary">{scholarship.amount}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Deadline</p>
                          <p className="font-semibold">{scholarship.deadline}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Eligibility</p>
                          <p className="text-sm">{scholarship.eligibility}</p>
                        </div>
                        <Button className="w-full">Apply Now</Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    No scholarships available at the moment.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {uniEvents.length > 0 ? (
                  uniEvents.map(event => (
                    <Card key={event.id} className="border-2">
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                        <Button variant="outline" className="w-full">Register for Event</Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    No upcoming events at the moment.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="news" className="space-y-6">
              <div className="space-y-4">
                {uniNews.length > 0 ? (
                  uniNews.map(news => (
                    <Card key={news.id} className="border-2">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge>{news.category}</Badge>
                              <span className="text-sm text-muted-foreground">{news.date}</span>
                            </div>
                            <CardTitle>{news.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{news.content}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No news updates at the moment.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}

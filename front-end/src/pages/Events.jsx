import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { events, newsItems } from "@/data/mockData";
import { Search, Calendar, MapPin, Newspaper } from "lucide-react";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.universityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNews = newsItems.filter(news =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.universityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Events</span> & News
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-8">
            Stay updated with the latest university events and announcements
          </p>

          {/* Search */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events and news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <Tabs defaultValue="events" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <div className="grid md:grid-cols-2 gap-6">
                {filteredEvents.map(event => (
                  <Card key={event.id} className="border-2 hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <Badge>{event.type}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="text-base">
                        {event.universityName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        {event.description}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground pt-4 border-t">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    No events found matching your search.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="news">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map(news => (
                  <Card key={news.id} className="border-2 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="text-5xl mb-4 text-center">{news.image}</div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{news.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(news.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <CardTitle className="text-lg mb-1">{news.title}</CardTitle>
                      <CardDescription>{news.universityName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {news.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredNews.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    No news found matching your search.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}

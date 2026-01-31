import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Award, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Unisphere</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Transforming higher education access in Punjab through technology and innovation
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
                <CardDescription className="text-base pt-4">
                  To simplify the university selection process for students in Punjab by providing a centralized platform that offers personalized recommendations, comprehensive information, and direct access to educational opportunities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
                <CardDescription className="text-base pt-4">
                  To become the leading educational platform in Pakistan, empowering every student to make informed decisions about their higher education and connect with opportunities that match their aspirations and potential.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Story Section */}
          <div className="max-w-4xl mx-auto space-y-6 mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <p className="text-lg text-muted-foreground">
              Unisphere was born from a simple observation: thousands of students in Punjab struggle to find the right university each year. The process is fragmented, confusing, and often leads to missed opportunities. Students spend countless hours visiting multiple university websites, gathering information from unreliable sources, and making decisions without complete information.
            </p>
            <p className="text-lg text-muted-foreground">
              We realized that what students needed was a single platform that could:
            </p>
            <ul className="space-y-2 text-lg text-muted-foreground list-disc list-inside">
              <li>Provide personalized university recommendations based on their academic performance</li>
              <li>Offer comprehensive, verified information about all universities in Punjab</li>
              <li>Connect them with scholarship opportunities they're eligible for</li>
              <li>Keep them updated with events, deadlines, and important news</li>
            </ul>
            <p className="text-lg text-muted-foreground">
              That's how Unisphere came to life - a SaaS platform designed to bridge the gap between students and universities, making higher education more accessible and transparent for everyone.
            </p>
          </div>

          {/* Team Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              Unisphere is developed by a team of dedicated students from the University of Sialkot
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="border-2">
                <CardHeader>
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-3xl">
                    👨‍💻
                  </div>
                  <CardTitle>Muhammad Abu Bakr Baig</CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 text-3xl">
                    👨‍💻
                  </div>
                  <CardTitle>Muhammad Abu Hurairah Baig</CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-3xl">
                    👨‍💻
                  </div>
                  <CardTitle>Adil Arshad</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Values */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center border-2">
                <CardHeader>
                  <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle>Student-Centric</CardTitle>
                  <CardDescription className="text-base">
                    Every feature is designed with students' needs and success in mind
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center border-2">
                <CardHeader>
                  <Award className="h-12 w-12 mx-auto mb-4 text-accent" />
                  <CardTitle>Transparency</CardTitle>
                  <CardDescription className="text-base">
                    We provide accurate, verified information from trusted sources
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center border-2">
                <CardHeader>
                  <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle>Innovation</CardTitle>
                  <CardDescription className="text-base">
                    We leverage technology to solve real problems in education
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

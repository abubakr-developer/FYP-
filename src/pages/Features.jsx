import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  TrendingUp, 
  Award, 
  Bell,
  Shield,
  BarChart3,
  FileText,
  Calendar,
  Users,
  Building2,
  GraduationCap,
  Target
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Search,
      title: "Smart University Search",
      description: "Advanced search and filtering options to find universities by location, programs, rankings, and more.",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Personalized Recommendations",
      description: "AI-powered recommendation system that suggests universities based on your academic percentage and interests.",
      color: "text-accent"
    },
    {
      icon: Award,
      title: "Scholarship Database",
      description: "Comprehensive database of scholarships with eligibility criteria, deadlines, and application requirements.",
      color: "text-primary"
    },
    {
      icon: Target,
      title: "Academic Profile",
      description: "Create detailed profiles with your academic achievements, interests, and career goals.",
      color: "text-accent"
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Get instant alerts about admission deadlines, scholarship opportunities, and important updates.",
      color: "text-primary"
    },
    {
      icon: Calendar,
      title: "Events & News",
      description: "Stay informed about university events, open houses, admission sessions, and latest news.",
      color: "text-accent"
    },
    {
      icon: FileText,
      title: "Detailed University Profiles",
      description: "Access comprehensive information about universities including programs, facilities, and admission criteria.",
      color: "text-primary"
    },
    {
      icon: BarChart3,
      title: "Comparison Tools",
      description: "Compare multiple universities side-by-side to make informed decisions.",
      color: "text-accent"
    },
    {
      icon: Users,
      title: "Student Dashboard",
      description: "Personalized dashboard to manage your profile, track applications, and view recommendations.",
      color: "text-primary"
    },
    {
      icon: Building2,
      title: "University Admin Panel",
      description: "Universities can manage their profiles, programs, scholarships, and communicate with students.",
      color: "text-accent"
    },
    {
      icon: Shield,
      title: "Security-Focused Design",
      description: "Platform designed with security best practices in mind. Full authentication and encryption features coming soon.",
      color: "text-primary"
    },
    {
      icon: GraduationCap,
      title: "Program Explorer",
      description: "Explore detailed program information including curriculum, duration, fees, and career prospects.",
      color: "text-accent"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for Your
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Education Journey</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to discover, compare, and apply to universities in Punjab
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-all hover:scale-105">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Everyone
            </h2>
            <p className="text-lg text-muted-foreground">
              Unisphere serves students, universities, and administrators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>For Students</CardTitle>
                <CardContent className="px-0 pt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">✓ Personalized university recommendations</p>
                  <p className="text-sm text-muted-foreground">✓ Scholarship discovery and tracking</p>
                  <p className="text-sm text-muted-foreground">✓ Academic profile management</p>
                  <p className="text-sm text-muted-foreground">✓ Event and news updates</p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>For Universities</CardTitle>
                <CardContent className="px-0 pt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">✓ Manage university profiles</p>
                  <p className="text-sm text-muted-foreground">✓ Program and course management</p>
                  <p className="text-sm text-muted-foreground">✓ Scholarship administration</p>
                  <p className="text-sm text-muted-foreground">✓ Student engagement analytics</p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>For Administrators</CardTitle>
                <CardContent className="px-0 pt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">✓ Platform oversight and control</p>
                  <p className="text-sm text-muted-foreground">✓ User and university validation</p>
                  <p className="text-sm text-muted-foreground">✓ System analytics and reporting</p>
                  <p className="text-sm text-muted-foreground">✓ Content moderation</p>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

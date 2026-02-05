// UniversityPendingApproval.jsx
// This is the page the university sees after successful registration submission.
// It informs them that their account is pending admin approval.

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Mail } from "lucide-react";

export default function UniversityPendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-background dark:from-purple-950/20 dark:via-pink-950/10 dark:to-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Registration Pending</h1>
          <p className="text-muted-foreground">
            Your institution's registration is under review.
          </p>
        </div>

        {/* Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle>Thank You for Registering!</CardTitle>
            <CardDescription>
              Our admin team will review your submission shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg text-sm flex items-start gap-3">
              <Mail className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground">
                You will receive an email notification at your official email address once your account is approved. After approval, you can log in to the University Portal.
              </p>
            </div>

            <Button 
              variant="outline" 
              className="w-full" 
              asChild
            >
              <Link to="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
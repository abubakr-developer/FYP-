import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Unisphere</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting students with the best universities in Punjab through smart recommendations and comprehensive information.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/universities" className="text-muted-foreground hover:text-primary transition-colors">
                  Universities
                </Link>
              </li>
              <li>
                <Link to="/scholarships" className="text-muted-foreground hover:text-primary transition-colors">
                  Scholarships
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  Events & News
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Students</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">
                  Platform Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@unisphere.edu.pk</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Punjab, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 Unisphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

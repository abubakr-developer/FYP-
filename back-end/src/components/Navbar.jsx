import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Unisphere
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/features" className="text-sm font-medium transition-colors hover:text-primary">
            Features
          </Link>
          <Link to="/universities" className="text-sm font-medium transition-colors hover:text-primary">
            Universities
          </Link>
          <Link to="/scholarships" className="text-sm font-medium transition-colors hover:text-primary">
            Scholarships
          </Link>
          <Link to="/events" className="text-sm font-medium transition-colors hover:text-primary">
            Events & News
          </Link>
          <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            <Link
              to="/"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/features"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/universities"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Universities
            </Link>
            <Link
              to="/scholarships"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Scholarships
            </Link>
            <Link
              to="/events"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Events & News
            </Link>
            <Link
              to="/about"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full">Login</Button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

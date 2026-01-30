import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Building2, Shield, X } from "lucide-react";

export default function RoleSelection({ isOpen, onClose }) {
  if (!isOpen) return null;

  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Access personalized recommendations",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500",
      path: "/studentlogin"
    },
    {
      id: "university",
      title: "University",
      description: "Manage your institution's profile",
      icon: Building2,
      color: "from-purple-500 to-pink-500",
      path: "/university-login"
    },
    {
      id: "admin",
      title: "Admin",
      description: "System administration panel",
      icon: Shield,
      color: "from-orange-500 to-red-500",
      path: "/admin-login"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-200">
        <Card className="border-2 shadow-2xl">
          <CardContent className="p-6">
            <div className="relative mb-6">
              <button
                onClick={onClose}
                className="absolute -top-2 -right-2 rounded-full p-2 hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Select Your Role</h2>
                <p className="text-muted-foreground text-sm">
                  Choose how you want to sign in
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {roles.map((role) => (
                <Link
                  key={role.id}
                  to={role.path}
                  onClick={onClose}
                  className="block group"
                >
                  <Card className="border-2 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                          <role.icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="font-semibold text-lg">{role.title}</h3>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                        <div className="text-muted-foreground group-hover:text-primary transition-colors text-xl">
                          →
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
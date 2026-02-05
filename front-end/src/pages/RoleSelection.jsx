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
      path: "/studentlogin",
    },
    {
      id: "university",
      title: "University",
      description: "Manage your institution's profile",
      icon: Building2,
      color: "from-purple-500 to-pink-500",
      path: "/university-login",
    },
    {
      id: "admin",
      title: "Admin",
      description: "System administration panel",
      icon: Shield,
      color: "from-orange-500 to-red-500",
      path: "/admin-login",
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop – covers everything, blurs background, blocks scroll */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content – centered, above backdrop */}
      <div className="relative mt-[600px] z-[10000] w-full max-w-lg px-4 animate-in zoom-in-95 duration-300">
        <Card className="border-2 shadow-2xl bg-background/95 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8 relative ">
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 rounded-full bg-background m-8 p-3 shadow-md hover:bg-muted transition-colors z-10"
              aria-label="Close role selection"
            >
              <X className=" h-5 w-5" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Choose Your Role
              </h2>
              <p className="text-muted-foreground">
                Select how you'd like to continue
              </p>
            </div>

            <div className="grid gap-5">
              {roles.map((role) => (
                <Link
                  key={role.id}
                  to={role.path}
                  onClick={onClose}
                  className="block group focus:outline-none focus:ring-2 focus:ring-primary rounded-xl"
                >
                  <Card className="border transition-all hover:border-primary/60 hover:shadow-xl hover:-translate-y-1 duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-5">
                        <div
                          className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                        >
                          <role.icon className="h-8 w-8 text-white" />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-xl mb-1">{role.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {role.description}
                          </p>
                        </div>

                        <span className="text-muted-foreground group-hover:text-primary text-2xl font-light transition-colors">
                          →
                        </span>
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
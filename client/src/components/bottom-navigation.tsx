import { Link, useLocation } from "wouter";
import { Home, Route, Mic, Gamepad2, TrendingUp } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/learning-paths", label: "Paths", icon: Route },
    { path: "/speaking-zone", label: "Speak", icon: Mic },
    { path: "/games", label: "Games", icon: Gamepad2 },
    { path: "/progress", label: "Progress", icon: TrendingUp },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className="flex flex-col items-center space-y-1 transition-colors cursor-pointer">
              <item.icon 
                className={`w-5 h-5 ${
                  location === item.path 
                    ? 'text-primary-custom' 
                    : 'text-medium-custom hover:text-dark-custom'
                }`} 
              />
              <span 
                className={`text-xs ${
                  location === item.path 
                    ? 'text-primary-custom font-medium' 
                    : 'text-medium-custom'
                }`}
              >
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}

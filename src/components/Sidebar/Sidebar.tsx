import {
  Home,
  MessageSquare,
  Settings,
  Activity,
  Star,
  Users,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const [isWideScreen, setIsWideScreen] = useState(false);

  // Custom hook to handle screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isWide = width > 1620;
      console.log("Window width:", width, "Is wide:", isWide);
      setIsWideScreen(isWide);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Style variables
  const gradientTextStyle =
    "bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-transparent bg-clip-text";
  const iconStyle = {
    className: "w-6 h-6",
    strokeWidth: 1.5,
    style: { stroke: "url(#blue-pink-gradient)" },
  };

  const navItems = [
    { name: "Dashboard", icon: Home, href: "/admin" },
    { name: "Chat History", icon: MessageSquare, href: "/admin/chats" },
    { name: "Bot Config", icon: Settings, href: "/admin/config" },
    { name: "Total Chats", icon: Activity, href: "/admin/metrics/chats" },
    { name: "Satisfaction", icon: Star, href: "/admin/metrics/satisfaction" },
    { name: "Demographics", icon: Users, href: "/admin/metrics/users" },
    { name: "Peak Usage", icon: Clock, href: "/admin/metrics/usage" },
  ];

  return (
    <aside
      className={`
        h-screen bg-zinc-900 transition-all duration-300
        fixed left-0 top-0
        border-r border-gray-800
        ${isWideScreen ? "w-[10%]" : "w-20"}
      `}
    >
      {/* Gradient definition for icons */}
      <svg width="0" height="0">
        <defs>
          <linearGradient
            id="blue-pink-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#0ff" />
            <stop offset="100%" stopColor="#f0f" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex flex-col items-center py-8 space-y-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group relative flex items-center
                ${isWideScreen ? "w-[80%]" : "w-12"}
                ${isWideScreen ? "px-4" : "px-3"} py-3
                rounded-full
                transition-all duration-300
                ${
                  isActive
                    ? "bg-black shadow-[0_0_10px_#0ff,0_0_20px_#f0f]"
                    : "hover:bg-black/50"
                }
              `}
            >
              <Icon {...iconStyle} />
              <span
                className={`
                ${gradientTextStyle}
                ml-3 font-medium
                ${isWideScreen ? "block" : "hidden"}
                whitespace-nowrap
              `}
              >
                {item.name}
              </span>

              {/* Tooltip for collapsed state */}
              <div
                className={`
                absolute left-full ml-2
                px-2 py-1
                bg-black rounded
                text-gray-300 text-sm
                opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                transition-all duration-200
                ${isWideScreen ? "hidden" : "block"}
                whitespace-nowrap
              `}
              >
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;

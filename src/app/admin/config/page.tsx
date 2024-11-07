"use client";

import AdminAuthCheck from "@/components/AdminDashboard/AdminAuthCheck";
import BotConfiguration from "@/components/AdminDashboard/BotConfiguration";
import Sidebar from "@/components/Sidebar/Sidebar";
import NewsBanner from "@/components/NewsBanner/NewsBanner";
import { useState, useEffect } from "react";
import { Settings } from "lucide-react";

export default function BotConfig() {
  const [isWideScreen, setIsWideScreen] = useState(false);

  // Reusable style variables
  const gradientTextStyle =
    "bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-transparent bg-clip-text";
  const iconStyle = {
    className: "w-10 h-10",
    strokeWidth: 1.5,
    style: { stroke: "url(#blue-pink-gradient)" },
  };

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 1920);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-900">
      <Sidebar />
      <main
        className={`flex-1 p-8 transition-all duration-300 bg-zinc-900 ${
          isWideScreen ? "ml-[10%]" : "ml-20"
        }`}
      >
        <AdminAuthCheck>
          <div className="max-w-7xl mx-auto bg-zinc-900">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Settings {...iconStyle} />
                <h1 className={`text-2xl font-bold ${gradientTextStyle}`}>
                  Bot Settings
                </h1>
                {/* Gradient definition for icon */}
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
              </div>
            </div>

            <div className="bg-zinc-900 rounded-[20px] shadow-[0_0_10px_#0ff,0_0_20px_#f0f] group hover:bg-black/90 transition-all">
              <BotConfiguration />
            </div>
          </div>
        </AdminAuthCheck>
      </main>
      <NewsBanner />
    </div>
  );
}

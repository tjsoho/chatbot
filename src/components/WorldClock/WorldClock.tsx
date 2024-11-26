"use client";

import { useState, useEffect } from "react";
import { Clock, PauseCircle, PlayCircle } from "lucide-react";
import TimeZoneModal from "./TimeZoneModal";

interface TimeZone {
  name: string;
  timezone: string;
  flag: string;
}

const WorldClock = () => {
  const [times, setTimes] = useState<{ [key: string]: string }>({});
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<TimeZone | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const timeZones: TimeZone[] = [
    { name: "London", timezone: "Europe/London", flag: "🇬🇧" },
    { name: "New York", timezone: "America/New_York", flag: "🇺🇸" },
    { name: "Chicago", timezone: "America/Chicago", flag: "🇺🇸" },
    { name: "Los Angeles", timezone: "America/Los_Angeles", flag: "🇺🇸" },
    { name: "Vienna", timezone: "Europe/Vienna", flag: "🇦🇹" },
    { name: "Auckland", timezone: "Pacific/Auckland", flag: "🇳🇿" },
    { name: "New Delhi", timezone: "Asia/Kolkata", flag: "🇮🇳" },
    { name: "Singapore", timezone: "Asia/Singapore", flag: "🇸🇬" },
  ];

  // Screen size handler
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isWide = width > 1620;
      setIsWideScreen(isWide);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Time updater
  useEffect(() => {
    const updateTimes = () => {
      const newTimes: { [key: string]: string } = {};
      timeZones.forEach(({ name, timezone }) => {
        try {
          const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          const time = formatter.format(new Date());
          newTimes[timezone] = time;
        } catch (error) {
          console.error(`Error for ${name} (${timezone}):`, error);
          const utcFormatter = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          newTimes[timezone] = utcFormatter.format(new Date());
        }
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const gradientTextStyle =
    "bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-transparent bg-clip-text";

  const togglePauseAndExpand = () => {
    setIsPaused(!isPaused);
    setIsExpanded(!isExpanded);
  };

  return (
    <aside
      className={`
        h-screen bg-zinc-900 transition-all duration-300
        fixed right-0 top-0
        border-l border-gray-800
        ${isExpanded ? "w-[20%]" : isWideScreen ? "w-[10%]" : "w-20"}
      `}
    >
      {/* Control Button */}
      <div className="absolute left-0 top-1/2 -translate-x-1/2 transform z-30">
        <button
          onClick={togglePauseAndExpand}
          className="p-2 rounded-full bg-zinc-900 border border-gray-800 hover:bg-black/50 transition-all duration-300 shadow-[0_0_10px_#0ff,0_0_20px_#f0f]"
        >
          {isPaused ? (
            <PlayCircle
              className="w-6 h-6"
              style={{ stroke: "url(#blue-pink-gradient)" }}
            />
          ) : (
            <PauseCircle
              className="w-6 h-6"
              style={{ stroke: "url(#blue-pink-gradient)" }}
            />
          )}
        </button>
      </div>

      <div className="relative h-screen overflow-hidden">
        {/* Gradient Overlays - only show when not expanded */}
        {!isExpanded && (
          <>
            <div className="absolute left-0 top-0 right-0 h-20 bg-gradient-to-b from-zinc-900 to-transparent z-10"></div>
            <div className="absolute left-0 bottom-0 right-0 h-20 bg-gradient-to-t from-zinc-900 to-transparent z-10"></div>
          </>
        )}

        {/* Clock Icon */}
        <div className="absolute top-8 left-0 right-0 flex justify-center z-20">
          <Clock
            className="w-6 h-6"
            strokeWidth={1.5}
            style={{ stroke: "url(#blue-pink-gradient)" }}
          />
        </div>

        {/* Content Container */}
        <div
          className={`
            flex flex-col items-center pt-24
            ${isExpanded ? "flex-wrap h-full content-start gap-4 px-4" : ""}
          `}
          style={
            !isPaused
              ? {
                  animation: "scrollY 20s linear infinite",
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                }
              : {}
          }
        >
          {/* Show single array when expanded, double array when scrolling */}
          {(isExpanded ? timeZones : [...timeZones, ...timeZones]).map(
            ({ name, timezone, flag }, index) => (
              <div
                key={`${timezone}-${index}`}
                className={`
                group relative flex flex-col items-center
                ${isExpanded ? "w-[45%]" : isWideScreen ? "w-[80%]" : "w-12"}
                px-3 py-6
                rounded-full
                transition-all duration-300
                hover:bg-black/50
                cursor-pointer
              `}
                onClick={() => setSelectedZone({ name, timezone, flag })}
              >
                <div className="absolute inset-0" />
                <span className="text-2xl mb-2 relative z-10">{flag}</span>
                <span
                  className={`
                  ${gradientTextStyle}
                  text-base font-medium
                  relative z-10
                  ${isExpanded || isWideScreen ? "block" : "hidden"}
                  whitespace-nowrap
                `}
                >
                  {name}
                </span>
                <span
                  className={`
                  ${gradientTextStyle}
                  text-lg font-bold
                  relative z-10
                  ${isExpanded || isWideScreen ? "block" : "hidden"}
                  whitespace-nowrap
                `}
                >
                  {times[timezone]}
                </span>

                {/* Tooltip - only show when not expanded */}
                {!isExpanded && (
                  <div
                    className={`
                    absolute left-[-120%] ml-2
                    px-2 py-1
                    bg-black rounded
                    text-gray-300 text-base
                    opacity-0 invisible
                    group-hover:opacity-100 group-hover:visible
                    transition-all duration-200
                    ${isWideScreen ? "hidden" : "block"}
                    whitespace-nowrap
                    z-20
                  `}
                  >
                    {name}: {times[timezone]}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Gradient definition */}
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

        <style jsx>{`
          @keyframes scrollY {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }
        `}</style>
      </div>

      <TimeZoneModal
        isOpen={!!selectedZone}
        onClose={() => setSelectedZone(null)}
        cityName={selectedZone?.name || ""}
        flag={selectedZone?.flag || ""}
        timezone={selectedZone?.timezone || ""}
        currentTime={selectedZone ? times[selectedZone.timezone] : ""}
      />
    </aside>
  );
};

export default WorldClock;


// // North America
// "America/New_York"      // Eastern Time
// "America/Chicago"       // Central Time
// "America/Denver"        // Mountain Time
// "America/Los_Angeles"   // Pacific Time
// "America/Phoenix"       // Arizona
// "America/Anchorage"     // Alaska
// "Pacific/Honolulu"      // Hawaii

// // Europe
// "Europe/London"         // UK
// "Europe/Paris"          // France
// "Europe/Berlin"         // Germany
// "Europe/Rome"          // Italy
// "Europe/Madrid"        // Spain

// // Asia
// "Asia/Tokyo"           // Japan
// "Asia/Shanghai"        // China
// "Asia/Singapore"       // Singapore
// "Asia/Dubai"           // UAE
// "Asia/Kolkata"         // India
// "Asia/Seoul"           // South Korea

// // Australia & Pacific
// "Australia/Sydney"     // Eastern Australia
// "Australia/Perth"      // Western Australia
// "Pacific/Auckland"     // New Zealand

// // South America
// "America/Sao_Paulo"    // Brazil
// "America/Buenos_Aires" // Argentina
// "America/Santiago"     // Chile
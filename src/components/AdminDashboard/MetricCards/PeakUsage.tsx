import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Clock } from 'lucide-react';

interface UsageData {
  dayCount: Record<string, number>;
  hourCount: Record<number, number>;
  busiestDay: string;
  busiestTimeSlot: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function PeakUsage() {
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<UsageData>({
    dayCount: {},
    hourCount: {},
    busiestDay: '',
    busiestTimeSlot: ''
  });

  // Reusable style variables
  const gradientTextStyle = "bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-transparent bg-clip-text";
  const cardTitleStyle = `text-2xl font-bold mb-2 ${gradientTextStyle}`;
  const cardContainerStyle = "bg-zinc-900 rounded-[20px] p-6 group hover:bg-black/90 transition-all shadow-[0_0_10px_#0ff,0_0_20px_#f0f]";
  const iconStyle = {
    className: "w-10 h-10",
    strokeWidth: 1.5,
    style: { stroke: 'url(#blue-pink-gradient)' }
  };

  useEffect(() => {
    const fetchPeakUsage = async () => {
      try {
        const q = query(collection(db, "chats"));
        const querySnapshot = await getDocs(q);
        
        const dayCount: Record<string, number> = {};
        const hourCount: Record<number, number> = {};

        // Initialize counts
        DAYS.forEach(day => dayCount[day] = 0);
        for (let i = 0; i < 24; i++) hourCount[i] = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.createdAt) {
            const date = data.createdAt.toDate();
            const day = DAYS[date.getDay()];
            const hour = date.getHours();

            dayCount[day]++;
            hourCount[hour]++;
          }
        });

        // Find busiest day
        const busiestDay = Object.entries(dayCount)
          .reduce((a, b) => a[1] > b[1] ? a : b)[0];

        // Find busiest 2-hour window
        let maxCount = 0;
        let busiestHour = 0;
        for (let i = 0; i < 23; i++) {
          const twoHourCount = hourCount[i] + hourCount[i + 1];
          if (twoHourCount > maxCount) {
            maxCount = twoHourCount;
            busiestHour = i;
          }
        }

        const busiestTimeSlot = `${busiestHour % 12 || 12}${busiestHour < 12 ? 'AM' : 'PM'} - ${(busiestHour + 2) % 12 || 12}${(busiestHour + 2) < 12 ? 'AM' : 'PM'}`;

        setUsageData({
          dayCount,
          hourCount,
          busiestDay,
          busiestTimeSlot
        });
      } catch (error) {
        console.error("Error fetching peak usage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeakUsage();
  }, []);

  return (
    <div className={cardContainerStyle}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={cardTitleStyle}>Peak Usage</h3>
        </div>
        <div className="ml-auto">
          <Clock {...iconStyle} />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="blue-pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ff" />
                <stop offset="100%" stopColor="#f0f" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-800 rounded w-3/4"></div>
          <div className="h-6 bg-gray-800 rounded w-2/3"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Busiest Day</div>
            <div className={`text-2xl font-bold ${gradientTextStyle}`}>
              {usageData.busiestDay}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Peak Hours</div>
            <div className={`text-2xl font-bold ${gradientTextStyle}`}>
              {usageData.busiestTimeSlot}
            </div>
          </div>

          {/* Daily Distribution */}
          <div className="pt-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 mb-2">Daily Distribution</div>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((day) => (
                <div key={day} className="text-center">
                  <div className="h-16 relative">
                    <div 
                      className="absolute bottom-0 w-full bg-blue-200 rounded-t"
                      style={{
                        height: `${(usageData.dayCount[day] / Math.max(...Object.values(usageData.dayCount))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1">{day.slice(0, 1)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
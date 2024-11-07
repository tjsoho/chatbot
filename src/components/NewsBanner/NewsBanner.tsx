'use client';

import { MessageSquare, ThumbsUp, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import { collection, query, getDocs } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import NewsBannerWrapper from './NewsBannerWrapper';

interface NewsItem {
  icon: React.ElementType;
  value: string;
  label: string;
}

interface BannerStats {
  totalChats: number;
  distribution: Record<number, number>;
  totalRatings: number;
  busiestDay: string;
  busiestTimeSlot: string;
  male: number;
  female: number;
  unknown: number;
  isLoading: boolean;
}

export default function NewsBanner() {
  return (
    <NewsBannerWrapper>
      <NewsBannerContent />
    </NewsBannerWrapper>
  );
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function NewsBannerContent() {
  const [stats, setStats] = useState<BannerStats>({
    totalChats: 0,
    distribution: {},
    totalRatings: 0,
    busiestDay: '',
    busiestTimeSlot: '',
    male: 0,
    female: 0,
    unknown: 0,
    isLoading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      const adminAuth = localStorage.getItem('adminAuth');
      
      if (!user || adminAuth !== 'true') {
        console.log('User not authenticated as admin');
        return;
      }

      try {
        console.log('Starting data fetch...');

        // Fetch total chats and peak usage data
        const chatsQuery = query(collection(db, "chats"));
        const chatsSnapshot = await getDocs(chatsQuery);
        const totalChats = chatsSnapshot.size;

        console.log('Fetched chats:', totalChats);

        // Initialize counts for peak usage
        const dayCount: Record<string, number> = {};
        const hourCount: Record<number, number> = {};

        // Initialize counts
        DAYS.forEach(day => dayCount[day] = 0);
        for (let i = 0; i < 24; i++) hourCount[i] = 0;

        // Process chat timestamps
        chatsSnapshot.forEach((doc) => {
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

        // Fetch ratings distribution
        const ratingsQuery = query(collection(db, 'ratings'));
        const ratingsSnapshot = await getDocs(ratingsQuery);
        const distribution: Record<number, number> = {};
        let totalRatings = 0;
        ratingsSnapshot.forEach(doc => {
          const rating = doc.data().rating;
          distribution[rating] = (distribution[rating] || 0) + 1;
          totalRatings++;
        });

        // Fetch gender distribution
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        let maleCount = 0, femaleCount = 0, unknownCount = 0;
        usersSnapshot.forEach(doc => {
          const gender = doc.data().gender;
          if (gender === 'male') maleCount++;
          else if (gender === 'female') femaleCount++;
          else unknownCount++;
        });

        setStats({
          totalChats,
          distribution,
          totalRatings,
          busiestDay,
          busiestTimeSlot,
          male: maleCount,
          female: femaleCount,
          unknown: unknownCount,
          isLoading: false
        });

      } catch (error) {
        console.error('Error fetching banner stats:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && localStorage.getItem('adminAuth') === 'true') {
        fetchStats();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const newsItems: NewsItem[] = [
    { 
      icon: MessageSquare, 
      value: stats.totalChats.toLocaleString(), 
      label: 'Total Conversations' 
    },
    { 
      icon: ThumbsUp, 
      value: `${((stats.totalRatings > 0 
        ? Object.entries(stats.distribution).reduce(
            (sum, [rating, count]) => sum + (Number(rating) * Number(count)),
            0
          ) / stats.totalRatings
        : 0) * 20).toFixed(1)}%`, 
      label: 'Success Rate' 
    },
    { 
      icon: Clock, 
      value: stats.busiestTimeSlot, 
      label: 'Peak Usage Time' 
    },
    { 
      icon: Users, 
      value: `${((stats.male / (stats.male + stats.female + stats.unknown)) * 100).toFixed(1)}% M`, 
      label: 'Gender Distribution' 
    },
  ];

  const iconStyle = {
    className: "w-5 h-5",
    strokeWidth: 1.5,
    style: { stroke: 'url(#blue-pink-gradient)' }
  };

  const scrollingAnimation = {
    animation: 'scroll 20s linear infinite',
    '@keyframes scroll': {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(-50%)' }
    }
  } as React.CSSProperties;

  if (stats.isLoading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 border-t border-gray-800 backdrop-blur-sm">
        <div className="h-12 flex items-center justify-center">
          <div className="animate-pulse flex space-x-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-32 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 border-t border-gray-800 backdrop-blur-sm">
      <div className="relative h-12 overflow-hidden">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-zinc-900 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-zinc-900 to-transparent z-10"></div>

        {/* Scrolling Content */}
        <div 
          className="flex items-center space-x-12 whitespace-nowrap"
          style={{
            ...scrollingAnimation,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          {/* Double the items to create seamless loop */}
          {[...newsItems, ...newsItems].map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 px-4"
            >
              <item.icon {...iconStyle} />
              <span className="text-lg font-bold bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-transparent bg-clip-text">
                {item.value}
              </span>
              <span className="text-gray-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Icon Gradient Definition */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="blue-pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ff" />
              <stop offset="100%" stopColor="#f0f" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
} 
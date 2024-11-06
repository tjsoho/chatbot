import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { MessagesSquare } from 'lucide-react';

export default function TotalChatsCard() {
  const [totalChats, setTotalChats] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Reusable style variables
  const gradientTextStyle = "bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-transparent bg-clip-text";
  const cardTitleStyle = `text-2xl font-bold mb-2 ${gradientTextStyle}`;
  const cardContainerStyle = "bg-zinc-900 rounded-[20px] p-6 group hover:bg-black/90 transition-all shadow-[0_0_10px_#0ff,0_0_20px_#f0f]";
  const iconStyle = {
    className: "w-16 h-16 mb-2",
    strokeWidth: 1.5,
    style: { stroke: 'url(#blue-pink-gradient)' }
  };
  const iconGradientDef = (
    <svg width="0" height="0">
      <defs>
        <linearGradient id="blue-pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ff" />
          <stop offset="100%" stopColor="#f0f" />
        </linearGradient>
      </defs>
    </svg>
  );

  useEffect(() => {
    const fetchTotalChats = async () => {
      try {
        const q = query(collection(db, "chats"));
        const querySnapshot = await getDocs(q);
        setTotalChats(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching total chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalChats();
  }, []);

  return (
    <div className={cardContainerStyle}>
      <div className="flex flex-col items-center text-center space-y-2 h-full justify-center">
        {iconGradientDef}
        
        {loading ? (
          <div className="animate-pulse">
            <div className="h-16 bg-gray-800 rounded w-32"></div>
          </div>
        ) : (
          <div className={`text-8xl font-bold tracking-tight ${gradientTextStyle}`}>
            {totalChats.toLocaleString()}
          </div>
        )}
        <h3 className={cardTitleStyle}>Total Conversations</h3>
        <MessagesSquare {...iconStyle} />
      </div>
    </div>
  );
} 
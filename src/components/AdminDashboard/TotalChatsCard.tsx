import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { MessageSquare } from 'lucide-react';

export default function TotalChatsCard() {
  const [totalChats, setTotalChats] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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
    <div className="bg-gray-300 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Total Conversations</h3>
        <MessageSquare className="text-blue-500" size={24} />
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <div className="text-3xl font-bold text-blue-600">
          {totalChats.toLocaleString()}
        </div>
      )}
    </div>
  );
} 
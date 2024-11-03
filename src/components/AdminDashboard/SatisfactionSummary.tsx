import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { FaStar } from 'react-icons/fa';

type Rating = 1 | 2 | 3 | 4 | 5;

interface SatisfactionStats {
  averageRating: number;
  totalRatings: number;
  distribution: Record<Rating, number>;
}

export default function SatisfactionSummary() {
  const [stats, setStats] = useState<SatisfactionStats>({
    averageRating: 0,
    totalRatings: 0,
    distribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSatisfactionStats = async () => {
      try {
        const q = query(
          collection(db, "chats"),
          where("rating", "!=", null)
        );

        const querySnapshot = await getDocs(q);
        let totalRating = 0;
        let totalCount = 0;
        const distribution: Record<Rating, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};

        querySnapshot.forEach((doc) => {
          const rating = doc.data().rating as Rating;
          if (rating && rating >= 1 && rating <= 5) {
            totalRating += rating;
            totalCount++;
            distribution[rating]++;
          }
        });

        setStats({
          averageRating: totalCount > 0 ? totalRating / totalCount : 0,
          totalRatings: totalCount,
          distribution
        });
      } catch (error) {
        console.error("Error fetching satisfaction stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSatisfactionStats();
  }, []);

  return (
    <div className="bg-gray-300 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Overall Satisfaction</h3>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={index < Math.round(stats.averageRating)
                  ? "text-yellow-400"
                  : "text-gray-200"
                }
                size={24}
              />
            ))}
            <span className="ml-2 text-2xl font-bold text-gray-700">
              {stats.averageRating.toFixed(1)}
            </span>
          </div>

          <div className="text-sm text-gray-500">
            Based on {stats.totalRatings} ratings
          </div>

          {/* Rating Distribution Bars */}
          <div className="mt-4 space-y-2">
            {([5, 4, 3, 2, 1] as Rating[]).map((rating) => (
              <div key={rating} className="flex items-center text-sm">
                <span className="w-3">{rating}</span>
                <div className="ml-2 flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: `${stats.totalRatings > 0 
                        ? (stats.distribution[rating] / stats.totalRatings) * 100 
                        : 0}%`
                    }}
                  ></div>
                </div>
                <span className="ml-2 w-8 text-right text-gray-500">
                  {stats.distribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 
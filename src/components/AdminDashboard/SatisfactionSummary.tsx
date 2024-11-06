import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { FaStar } from "react-icons/fa";

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
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);

  // Reusable style variables
  const gradientTextStyle =
    "bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-transparent bg-clip-text";
  const cardTitleStyle = `text-2xl font-bold mb-2 ${gradientTextStyle}`;
  const cardContainerStyle =
    "bg-zinc-900 rounded-[20px] p-6 group hover:bg-black/90 transition-all shadow-[0_0_10px_#0ff,0_0_20px_#f0f] h-full flex flex-col justify-between";

  useEffect(() => {
    const fetchSatisfactionStats = async () => {
      try {
        const q = query(collection(db, "chats"), where("rating", "!=", null));

        const querySnapshot = await getDocs(q);
        let totalRating = 0;
        let totalCount = 0;
        const distribution: Record<Rating, number> = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        };

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
          distribution,
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
    <div className={cardContainerStyle}>
      <h3 className={cardTitleStyle}>Overall Satisfaction</h3>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-800 rounded w-1/2"></div>
        </div>
      ) : (
        <>
          
            <div className="flex items-center mb-3">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={
                    index < Math.round(stats.averageRating)
                      ? "text-yellow-400" // Keeping stars gold
                      : "text-gray-700" // Darker gray for empty stars
                  }
                  size={24}
                />
              ))}
              
              <span className={`ml-2 text-2xl font-bold ${gradientTextStyle}`}>
                {stats.averageRating.toFixed(1)}
              </span>
            </div>
              <div className="text-sm text-gray-400 -mt-8">
                Based on {stats.totalRatings} ratings
              </div>
          

          {/* Rating Distribution Bars */}
          <div className="mt-4 space-y-2">
            {([5, 4, 3, 2, 1] as Rating[]).map((rating) => (
              <div key={rating} className="flex items-center text-sm">
                <span className="w-3 text-gray-400">{rating}</span>
                <div className="ml-2 flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400" // Keeping bars gold
                    style={{
                      width: `${
                        stats.totalRatings > 0
                          ? (stats.distribution[rating] / stats.totalRatings) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="ml-2 w-8 text-right text-gray-400">
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

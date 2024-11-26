import { useState, useEffect } from 'react';

interface TimeZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
  flag: string;
  timezone: string;
  currentTime: string;
}

const TimeZoneModal = ({ isOpen, onClose, cityName, flag, timezone, currentTime }: TimeZoneModalProps) => {
  const [userLocation, setUserLocation] = useState<string>("your location");

  useEffect(() => {
    const getUserLocation = async () => {
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const { latitude, longitude } = position.coords;
          
          // Using OpenStreetMap's Nominatim service for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          
          // Get city name, fallback to suburb or town if city isn't available
          const city = data.address.city || 
                      data.address.suburb || 
                      data.address.town || 
                      data.address.village || 
                      "your location";
          
          setUserLocation(city);
        } catch (error) {
          console.error("Error getting location:", error);
        }
      }
    };

    if (isOpen) {
      getUserLocation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate time difference
  const getTimeDifference = () => {
    const localTime = new Date();
    const cityTime = new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
    const diffHours = (cityTime.getTime() - localTime.getTime()) / (1000 * 60 * 60);
    
    if (diffHours === 0) return `Same time as ${userLocation}`;
    const ahead = diffHours > 0;
    const hours = Math.abs(Math.round(diffHours));
    return `${hours} hour${hours !== 1 ? 's' : ''} ${ahead ? 'ahead of' : 'behind'} ${userLocation}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        className="bg-zinc-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_0_10px_#0ff,0_0_20px_#f0f]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center space-y-4">
          <span className="text-6xl">{flag}</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-transparent bg-clip-text">
            {cityName}
          </h2>
          <div className="text-4xl font-bold bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-transparent bg-clip-text">
            {currentTime}
          </div>
          <p className="text-gray-400 text-center">
            {getTimeDifference()}
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-black/50 hover:bg-black/70 rounded-full text-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeZoneModal; 
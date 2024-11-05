import React, { useState } from "react";
import Image from "next/image";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback?: string) => void;
  hasRatedBefore: boolean;
  onAlreadyRated?: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  onClose,
  onSubmit,
  hasRatedBefore,
  onAlreadyRated,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (rating: number, feedback?: string) => {
    setIsSubmitting(true);
    await onSubmit(rating, feedback);
  };

  if (isSubmitting) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BF63]" />
          <p className="mt-4 text-gray-600">Submitting your feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-brand-green-dark/50 z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl border-[2px] border-brand-green ">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/profile.png"
            alt="AI Assistant Profile"
            width={96}
            height={96}
            className="rounded-full border-2 border-brand-green shadow-lg"
          />
        </div>
        <h3 className="text-lg font-semibold mb-4 text-brand-green-dark text-center">
          How did I do? <br></br>Were your questions answered?
        </h3>

        {/* Star Rating */}
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl transform transition-transform ${
                star <= rating
                  ? "text-yellow-400 text-stroke-yellow-600 scale-105"
                  : "text-transparent text-stroke-gray-700"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Feedback Text Area */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Any additional feedback that would help me improve? (optional)"
          className="w-full p-2 border rounded-md mb-4 focus:ring-2 focus:ring-[#00BF63] focus:border-transparent"
          rows={3}
        />

        {/* Buttons */}
        <div className="flex justify-between space-x-2">
          {hasRatedBefore && !isSubmitting && (
            <button
              onClick={onAlreadyRated}
              className="px-4 py-2 border border-red-400 text-red-400 hover:bg-red-400 hover:text-white rounded-full transition-colors"
            >
              Close
            </button>
          )}
          <div className="flex space-x-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit(rating, feedback)}
              disabled={rating === 0 || isSubmitting}
              className="px-4 py-2 bg-brand-green text-white rounded-full hover:bg-brand-green-dark hover:text-brand-logo transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback?: string) => void;
  hasRatedBefore: boolean;
  onAlreadyRated?: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, onSubmit, hasRatedBefore, onAlreadyRated }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
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
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-xl">
        <h3 className="text-lg font-semibold mb-4">How did we do? Was your chat helpful?</h3>
        
        {/* Star Rating */}
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
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
          placeholder="Any additional feedback? (optional)"
          className="w-full p-2 border rounded-md mb-4 focus:ring-2 focus:ring-[#00BF63] focus:border-transparent"
          rows={3}
        />

        {/* Buttons */}
        <div className="flex justify-between space-x-2">
          {hasRatedBefore && !isSubmitting && (
            <button
              onClick={onAlreadyRated}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-md"
            >
              Close
            </button>
          )}
          <div className="flex space-x-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit(rating, feedback)}
              disabled={rating === 0 || isSubmitting}
              className="px-4 py-2 bg-[#00BF63] text-white rounded-md hover:bg-[#00A854] disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RateLimitedUI = ({ onTriggerRetry, onTriggerClose }) => {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-40 z-50">
        {/* Popup Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
          {/* Header */}
          <h2 className="text-xl font-bold text-maroon-700 mb-2">
            Rate Limit Reached
          </h2>

          {/* Message */}
          <p className="text-gray-700 mb-4">
            Too many requests were made. Please wait a bit before trying again.
          </p>

          {/* Countdown Placeholder */}
          <p className="text-red-600 font-medium mb-4">Try again in a minute</p>

          {/* Buttons */}
          <button
            onClick={onTriggerRetry}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-bold shadow hover:bg-green-700 transition mb-3"
          >
            Retry
          </button>

          <button
            onClick={onTriggerClose}
            className="w-full bg-gray-300 text-black py-2 rounded-lg font-medium shadow hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default RateLimitedUI;

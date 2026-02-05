import { useState } from 'react';

const AddCaloriesModal = ({ isOpen, onClose, onAdd, currentCalories, recommendedCalories }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseInt(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid calorie amount');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onAdd(numAmount);
      onClose();
      setAmount('');
    } catch (err) {
      setError(err.message || 'Failed to add calories');
    } finally {
      setIsLoading(false);
    }
  };

  const quickAdd = async (quickAmount) => {
    setIsLoading(true);
    setError('');

    try {
      await onAdd(quickAmount);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add calories');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const percentage = recommendedCalories 
    ? Math.round((currentCalories / recommendedCalories) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-green-100 p-6 max-w-md w-full animate-fadeIn shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Add Calories 🍽️</h3>
        
        <div className="mb-4 space-y-1">
          <p className="text-gray-600 text-sm">Today's total: <span className="font-bold text-orange-600">{currentCalories} cal</span></p>
          {recommendedCalories && (
            <>
              <p className="text-gray-600 text-sm">Daily goal: {recommendedCalories} cal</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">{percentage}% of daily goal</p>
            </>
          )}
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            onClick={() => quickAdd(100)}
            disabled={isLoading}
            className="py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold rounded-xl transition border border-orange-200 disabled:opacity-50"
          >
            +100
          </button>
          <button
            onClick={() => quickAdd(300)}
            disabled={isLoading}
            className="py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold rounded-xl transition border border-orange-200 disabled:opacity-50"
          >
            +300
          </button>
          <button
            onClick={() => quickAdd(500)}
            disabled={isLoading}
            className="py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold rounded-xl transition border border-orange-200 disabled:opacity-50"
          >
            +500
          </button>
        </div>

        {/* Custom Amount Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Custom Amount (calories)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="Enter calories"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition border border-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCaloriesModal;
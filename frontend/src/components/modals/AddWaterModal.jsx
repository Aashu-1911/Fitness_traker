import { useState } from 'react';

const AddWaterModal = ({ isOpen, onClose, onAdd, currentWater }) => {
  const [amount, setAmount] = useState('250');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseInt(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onAdd(numAmount);
      onClose();
      setAmount('250');
    } catch (err) {
      setError(err.message || 'Failed to add water');
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
      setError(err.message || 'Failed to add water');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-green-100 p-6 max-w-md w-full animate-fadeIn shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Add Water Intake 💧</h3>
        
        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-2">Today's total: <span className="font-bold text-green-600">{currentWater} ml</span></p>
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            onClick={() => quickAdd(250)}
            disabled={isLoading}
            className="py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition border border-blue-200 disabled:opacity-50"
          >
            +250ml
          </button>
          <button
            onClick={() => quickAdd(500)}
            disabled={isLoading}
            className="py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition border border-blue-200 disabled:opacity-50"
          >
            +500ml
          </button>
          <button
            onClick={() => quickAdd(1000)}
            disabled={isLoading}
            className="py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition border border-blue-200 disabled:opacity-50"
          >
            +1L
          </button>
        </div>

        {/* Custom Amount Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Custom Amount (ml)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="Enter amount in ml"
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

export default AddWaterModal;
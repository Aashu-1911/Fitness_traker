import { useState } from 'react';

const AddWorkoutModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: 0,
    type: 'Cardio',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Please enter workout name');
      return;
    }

    if (formData.duration <= 0) {
      setError('Duration must be greater than 0');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onAdd(formData);
      onClose();
      setFormData({ name: '', duration: 0, type: 'Cardio' });
    } catch (err) {
      setError(err.message || 'Failed to add workout');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-green-100 p-6 max-w-md w-full animate-fadeIn shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Add Workout 💪</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Workout Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Workout Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="e.g., Morning Run, Yoga Session"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="e.g., 30"
            />
          </div>

          {/* Workout Type */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Workout Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              <option value="Cardio" className="bg-white text-gray-800">Cardio</option>
              <option value="Strength" className="bg-white text-gray-800">Strength</option>
              <option value="Flexibility" className="bg-white text-gray-800">Flexibility</option>
              <option value="Sports" className="bg-white text-gray-800">Sports</option>
              <option value="Other" className="bg-white text-gray-800">Other</option>
            </select>
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
              {isLoading ? 'Adding...' : 'Add Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutModal;
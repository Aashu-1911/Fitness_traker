import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, saveProfile, updateProfile } from '../../api/profileApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

const HealthProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [apiError, setApiError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    age: 0,
    gender: 'Male',
    height: 0,
    weight: 0,
    activityLevel: 'Moderate',
    goals: 'Maintain',
    healthConditions: '',
  });

  const [errors, setErrors] = useState({
    age: '',
    height: '',
    weight: '',
  });

  // Fetch existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          setFormData({
            age: profile.age,
            gender: profile.gender,
            height: profile.height,
            weight: profile.weight,
            activityLevel: profile.activityLevel,
            goals: profile.goals,
            healthConditions: profile.healthConditions || '',
          });
          setIsEditing(true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { age: '', height: '', weight: '' };

    if (!formData.age || formData.age < 10 || formData.age > 120) {
      newErrors.age = 'Age must be between 10 and 120';
      isValid = false;
    }

    if (!formData.height || formData.height < 50 || formData.height > 300) {
      newErrors.height = 'Height must be between 50 and 300 cm';
      isValid = false;
    }

    if (!formData.weight || formData.weight < 20 || formData.weight > 500) {
      newErrors.weight = 'Weight must be between 20 and 500 kg';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (validateForm()) {
      setIsLoading(true);
      try {
        if (isEditing) {
          await updateProfile(formData);
        } else {
          await saveProfile(formData);
        }
        navigate('/dashboard');
      } catch (error) {
        setApiError(error.message || 'Failed to save profile');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'weight' 
        ? parseFloat(value) || 0 
        : value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-800 text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-green-100 p-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {isEditing ? 'Update Your Health Profile' : 'Complete Your Health Profile'}
          </h1>
          <p className="text-gray-600 text-lg">
            {user?.name}, let's personalize your fitness journey! 💪
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two-column grid on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-gray-700 font-semibold mb-2">
                Age *
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-xl bg-white border text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.age ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Enter your age"
              />
              {errors.age && (
                <p className="text-red-600 text-sm mt-1">{errors.age}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-gray-700 font-semibold mb-2">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              >
                <option value="Male" className="bg-white text-gray-800">Male</option>
                <option value="Female" className="bg-white text-gray-800">Female</option>
                <option value="Other" className="bg-white text-gray-800">Other</option>
              </select>
            </div>

            {/* Height */}
            <div>
              <label htmlFor="height" className="block text-gray-700 font-semibold mb-2">
                Height (cm) *
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height || ''}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-xl bg-white border text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.height ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="e.g. 170"
              />
              {errors.height && (
                <p className="text-red-600 text-sm mt-1">{errors.height}</p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-gray-700 font-semibold mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight || ''}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-xl bg-white border text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.weight ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="e.g. 70"
              />
              {errors.weight && (
                <p className="text-red-600 text-sm mt-1">{errors.weight}</p>
              )}
            </div>

            {/* Activity Level */}
            <div>
              <label htmlFor="activityLevel" className="block text-gray-700 font-semibold mb-2">
                Activity Level *
              </label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              >
                <option value="Low" className="bg-white text-gray-800">Low (Sedentary)</option>
                <option value="Moderate" className="bg-white text-gray-800">Moderate (1-3 days/week)</option>
                <option value="High" className="bg-white text-gray-800">High (4-7 days/week)</option>
              </select>
            </div>

            {/* Goals */}
            <div>
              <label htmlFor="goals" className="block text-gray-700 font-semibold mb-2">
                Fitness Goal *
              </label>
              <select
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              >
                <option value="Weight Loss" className="bg-white text-gray-800">Weight Loss</option>
                <option value="Maintain" className="bg-white text-gray-800">Maintain Weight</option>
                <option value="Muscle Gain" className="bg-white text-gray-800">Muscle Gain</option>
              </select>
            </div>
          </div>

          {/* Health Conditions - Full width */}
          <div>
            <label htmlFor="healthConditions" className="block text-gray-700 font-semibold mb-2">
              Health Conditions (Optional)
            </label>
            <textarea
              id="healthConditions"
              name="healthConditions"
              value={formData.healthConditions}
              onChange={handleChange}
              disabled={isLoading}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
              placeholder="Any health conditions we should know about? (e.g., diabetes, heart conditions, allergies)"
            />
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {apiError}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={isLoading}
              className="flex-1 py-3 px-6 rounded-xl bg-gray-100 text-gray-700 font-semibold border border-gray-300 hover:bg-gray-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'Saving...' : isEditing ? 'Update Profile' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthProfilePage;
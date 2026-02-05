import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getProfile } from '../../api/profileApi.js';
import { getTodayLog, addWater, addCalories, addWorkout } from '../../api/logApi.js';
import AddWaterModal from '../../components/modals/AddWaterModal.jsx';
import AddCaloriesModal from '../../components/modals/AddCaloriesModal.jsx';
import AddWorkoutModal from '../../components/modals/AddWorkoutModal.jsx';

const DashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [todayLog, setTodayLog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modal states
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showCaloriesModal, setShowCaloriesModal] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileData, logData] = await Promise.all([
        getProfile(),
        getTodayLog(),
      ]);
      setProfile(profileData);
      setTodayLog(logData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleAddWater = async (amount) => {
    const updatedLog = await addWater(amount);
    setTodayLog(updatedLog);
  };

  const handleAddCalories = async (amount) => {
    const updatedLog = await addCalories(amount);
    setTodayLog(updatedLog);
  };

  const handleAddWorkout = async (workout) => {
    const updatedLog = await addWorkout(workout);
    setTodayLog(updatedLog);
  };

  const getBMIColor = (category) => {
    if (!category) return 'bg-gray-400';
    if (category === 'Underweight') return 'bg-blue-400';
    if (category === 'Normal weight') return 'bg-green-400';
    if (category === 'Overweight') return 'bg-yellow-400';
    if (category === 'Obese') return 'bg-red-400';
    return 'bg-gray-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-800 text-2xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">Your personalized fitness journey</p>
        </div>

        {/* No Profile CTA */}
        {!profile && (
          <div className="bg-white rounded-3xl p-8 border border-green-200 shadow-xl text-center mb-8 animate-fadeIn">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Complete Your Health Profile</h2>
            <p className="text-gray-600 mb-6">
              Let's get to know you better! Fill in your health details to unlock personalized recommendations and track your progress.
            </p>
            <Link
              to="/profile"
              className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-200"
            >
              Set Up Profile Now
            </Link>
          </div>
        )}

        {/* Profile Stats Grid */}
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* BMI Card */}
            <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-semibold">BMI</h3>
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {profile.bmi?.toFixed(1) || 'N/A'}
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getBMIColor(profile.bmiCategory)}`}>
                {profile.bmiCategory || 'Unknown'}
              </span>
            </div>

            {/* Recommended Calories Card */}
            <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-semibold">Daily Calories</h3>
                <span className="text-2xl">🔥</span>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {profile.recommendedCalories || 'N/A'}
              </div>
              <span className="text-gray-600 text-sm">Recommended</span>
            </div>

            {/* Weight & Height Card */}
            <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-semibold">Body Stats</h3>
                <span className="text-2xl">⚖️</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 text-sm">Weight:</span>
                  <span className="text-2xl font-bold text-gray-800 ml-2">{profile.weight} kg</span>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Height:</span>
                  <span className="text-2xl font-bold text-gray-800 ml-2">{profile.height} cm</span>
                </div>
              </div>
            </div>

            {/* Activity & Goal Card */}
            <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-semibold">Your Plan</h3>
                <span className="text-2xl">🎯</span>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {profile.activityLevel} Activity
                  </span>
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                    {profile.goals}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Daily Tracking Section */}
        {profile && todayLog && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Water Intake Card */}
            <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800 font-semibold text-lg">Water Intake</h3>
                <span className="text-3xl">💧</span>
              </div>
              <div className="mb-4">
                <div className="text-4xl font-bold text-gray-800 mb-2">{todayLog.waterIntake} ml</div>
                <div className="w-full bg-blue-100 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-cyan-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((todayLog.waterIntake / 2000) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-gray-600 text-sm mt-2">Goal: 2000 ml</p>
              </div>
              <button
                onClick={() => setShowWaterModal(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition"
              >
                + Add Water
              </button>
            </div>

            {/* Calories Card */}
            <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800 font-semibold text-lg">Calories</h3>
                <span className="text-3xl">🔥</span>
              </div>
              <div className="mb-4">
                <div className="text-4xl font-bold text-gray-800 mb-2">{todayLog.calories} cal</div>
                {profile.recommendedCalories && (
                  <>
                    <div className="w-full bg-orange-100 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((todayLog.calories / profile.recommendedCalories) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-gray-600 text-sm mt-2">Goal: {profile.recommendedCalories} cal</p>
                  </>
                )}
              </div>
              <button
                onClick={() => setShowCaloriesModal(true)}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition"
              >
                + Add Calories
              </button>
            </div>

            {/* Workouts Card */}
            <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800 font-semibold text-lg">Workouts Today</h3>
                <span className="text-3xl">💪</span>
              </div>
              <div className="mb-4 min-h-[100px]">
                {todayLog.workouts && todayLog.workouts.length > 0 ? (
                  <div className="space-y-2 max-h-[100px] overflow-y-auto">
                    {todayLog.workouts.map((workout, index) => (
                      <div key={index} className="bg-green-50 rounded-lg p-3">
                        <p className="text-gray-800 font-semibold text-sm">{workout.name}</p>
                        <p className="text-gray-600 text-xs">{workout.duration} min • {workout.type}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">No workouts logged yet</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowWorkoutModal(true)}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition"
              >
                + Add Workout
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {profile && (
          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/profile"
                className="bg-green-50 hover:bg-green-100 p-4 rounded-xl text-center transition group border border-green-200"
              >
                <p className="text-3xl mb-2 group-hover:scale-110 transition">✏️</p>
                <p className="font-semibold text-gray-700">Edit Profile</p>
              </Link>
              <Link
                to="/progress"
                className="bg-green-50 hover:bg-green-100 p-4 rounded-xl text-center transition group border border-green-200"
              >
                <p className="text-3xl mb-2 group-hover:scale-110 transition">📈</p>
                <p className="font-semibold text-gray-700">View Progress</p>
              </Link>
              <Link
                to="/challenges"
                className="bg-green-50 hover:bg-green-100 p-4 rounded-xl text-center transition group border border-green-200"
              >
                <p className="text-3xl mb-2 group-hover:scale-110 transition">🎯</p>
                <p className="font-semibold text-gray-700">Challenges</p>
              </Link>
              <div className="bg-gray-100 p-4 rounded-xl text-center opacity-60 cursor-not-allowed border border-gray-200">
                <p className="text-3xl mb-2">🍎</p>
                <p className="font-semibold text-gray-500">Nutrition</p>
              </div>
            </div>
          </div>
        )}

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-3">🍎 Nutrition Coming Soon</h3>
            <p className="text-gray-600">Get personalized meal plans and nutrition recommendations.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-3">🏅 Achievements Coming Soon</h3>
            <p className="text-gray-600">Unlock badges and rewards as you reach your fitness milestones.</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddWaterModal
        isOpen={showWaterModal}
        onClose={() => setShowWaterModal(false)}
        onAdd={handleAddWater}
        currentWater={todayLog?.waterIntake || 0}
      />
      <AddCaloriesModal
        isOpen={showCaloriesModal}
        onClose={() => setShowCaloriesModal(false)}
        onAdd={handleAddCalories}
        currentCalories={todayLog?.calories || 0}
        recommendedCalories={profile?.recommendedCalories}
      />
      <AddWorkoutModal
        isOpen={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        onAdd={handleAddWorkout}
      />
    </div>
  );
};

export default DashboardPage;
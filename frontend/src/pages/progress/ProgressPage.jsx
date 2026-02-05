import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  getWeightTrend,
  getWaterTrend,
  getCalorieTrend,
  getWorkoutSummary,
} from '../../api/analyticsApi.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(30);

  const [weightData, setWeightData] = useState(null);
  const [waterData, setWaterData] = useState(null);
  const [calorieData, setCalorieData] = useState(null);
  const [workoutData, setWorkoutData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [weight, water, calorie, workout] = await Promise.all([
        getWeightTrend(days).catch(e => {
          console.error('Weight trend error:', e);
          return null;
        }),
        getWaterTrend(days).catch(e => {
          console.error('Water trend error:', e);
          return null;
        }),
        getCalorieTrend(days).catch(e => {
          console.error('Calorie trend error:', e);
          return null;
        }),
        getWorkoutSummary(days).catch(e => {
          console.error('Workout summary error:', e);
          return null;
        }),
      ]);

      setWeightData(weight);
      setWaterData(water);
      setCalorieData(calorie);
      setWorkoutData(workout);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err.message || 'Failed to fetch analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  // Chart configurations
  const weightChartData = {
    labels: weightData?.data.dates || [],
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightData?.data.weights || [],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
      },
    ],
  };

  const waterChartData = {
    labels: waterData?.data.dates || [],
    datasets: [
      {
        label: 'Water Intake (ml)',
        data: waterData?.data.waterIntakes || [],
        borderColor: 'rgba(6, 182, 212, 1)',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(6, 182, 212, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
      },
    ],
  };

  const calorieChartData = {
    labels: calorieData?.data.dates || [],
    datasets: [
      {
        label: 'Calories',
        data: calorieData?.data.calories || [],
        borderColor: 'rgba(234, 88, 12, 1)',
        backgroundColor: 'rgba(234, 88, 12, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(234, 88, 12, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
      },
    ],
  };

  const workoutChartData = {
    labels: workoutData?.data.dates || [],
    datasets: [
      {
        label: 'Workouts Completed',
        data: workoutData?.data.workoutCounts || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 10,
        hoverBackgroundColor: 'rgba(16, 185, 129, 1)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#1f2937',
          font: {
            size: 13,
            weight: 'bold',
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(16, 185, 129, 0.5)',
        borderWidth: 2,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#4b5563',
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.3)',
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: '#4b5563',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.3)',
          drawBorder: false,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-800 text-2xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Progress & Analytics 📊
          </h1>
          <p className="text-gray-600">Track your fitness journey over time</p>
        </div>

        {/* Time Period Selector */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setDays(7)}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              days === 7
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-green-50 border border-green-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setDays(30)}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              days === 30
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-green-50 border border-green-200'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setDays(90)}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              days === 90
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-green-50 border border-green-200'
            }`}
          >
            90 Days
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weight Chart */}
          <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-6 border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl shadow-lg">
                <span className="text-3xl">⚖️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Weight Trend</h3>
            </div>
            {weightData && weightData.data.weights.length > 0 ? (
              <>
                <div className="h-64 mb-6 bg-white rounded-xl p-4 shadow-inner">
                  <Line data={weightChartData} options={chartOptions} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-md hover:shadow-lg transition">
                    <p className="text-blue-600 text-xs font-semibold uppercase mb-1">Start</p>
                    <p className="text-gray-900 font-bold text-xl">{weightData.stats.startWeight} kg</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 shadow-md hover:shadow-lg transition">
                    <p className="text-green-600 text-xs font-semibold uppercase mb-1">Current</p>
                    <p className="text-gray-900 font-bold text-xl">{weightData.stats.currentWeight} kg</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 shadow-md hover:shadow-lg transition">
                    <p className="text-purple-600 text-xs font-semibold uppercase mb-1">Change</p>
                    <p className={`font-bold text-xl ${
                      weightData.stats.weightChange > 0 ? 'text-red-600' : weightData.stats.weightChange < 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {weightData.stats.weightChange > 0 ? '+' : ''}{weightData.stats.weightChange} kg
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-gray-400 text-lg mb-2">⚠️</p>
                  <p className="text-gray-500 font-medium">No weight data available.</p>
                  <p className="text-gray-400 text-sm">Start logging your weight!</p>
                </div>
              </div>
            )}
          </div>

          {/* Water Intake Chart */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl shadow-lg">
                <span className="text-3xl">💧</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Water Intake</h3>
            </div>
            {waterData && waterData.data.waterIntakes.length > 0 ? (
              <>
                <div className="h-64 mb-6 bg-white rounded-xl p-4 shadow-inner">
                  <Line data={waterChartData} options={chartOptions} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-4 border border-blue-200 shadow-md hover:shadow-lg transition">
                    <p className="text-blue-600 text-xs font-semibold uppercase mb-1">Daily Average</p>
                    <p className="text-gray-900 font-bold text-2xl">{waterData.stats.averageDaily} <span className="text-lg text-gray-600">ml</span></p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl p-4 border border-cyan-200 shadow-md hover:shadow-lg transition">
                    <p className="text-cyan-600 text-xs font-semibold uppercase mb-1">Total</p>
                    <p className="text-gray-900 font-bold text-2xl">{(waterData.stats.totalIntake / 1000).toFixed(1)} <span className="text-lg text-gray-600">L</span></p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-gray-400 text-lg mb-2">💧</p>
                  <p className="text-gray-500 font-medium">No water data available.</p>
                  <p className="text-gray-400 text-sm">Start tracking your hydration!</p>
                </div>
              </div>
            )}
          </div>

          {/* Calorie Intake Chart */}
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl p-6 border-2 border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl shadow-lg">
                <span className="text-3xl">🔥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Calorie Intake</h3>
            </div>
            {calorieData && calorieData.data.calories.length > 0 ? (
              <>
                <div className="h-64 mb-6 bg-white rounded-xl p-4 shadow-inner">
                  <Line data={calorieChartData} options={chartOptions} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-4 border border-orange-200 shadow-md hover:shadow-lg transition">
                    <p className="text-orange-600 text-xs font-semibold uppercase mb-1">Daily Average</p>
                    <p className="text-gray-900 font-bold text-2xl">{calorieData.stats.averageDaily} <span className="text-lg text-gray-600">cal</span></p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-xl p-4 border border-red-200 shadow-md hover:shadow-lg transition">
                    <p className="text-red-600 text-xs font-semibold uppercase mb-1">Total</p>
                    <p className="text-gray-900 font-bold text-2xl">{calorieData.stats.totalIntake.toLocaleString()} <span className="text-lg text-gray-600">cal</span></p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-gray-400 text-lg mb-2">🍽️</p>
                  <p className="text-gray-500 font-medium">No calorie data available.</p>
                  <p className="text-gray-400 text-sm">Start tracking your meals!</p>
                </div>
              </div>
            )}
          </div>

          {/* Workout Summary Chart */}
          <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-6 border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl shadow-lg">
                <span className="text-3xl">💪</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Workout Activity</h3>
            </div>
            {workoutData && workoutData.data.workoutCounts.length > 0 ? (
              <>
                <div className="h-64 mb-6 bg-white rounded-xl p-4 shadow-inner">
                  <Bar data={workoutChartData} options={chartOptions} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200 shadow-md hover:shadow-lg transition">
                    <p className="text-green-600 text-xs font-semibold uppercase mb-1">Total Workouts</p>
                    <p className="text-gray-900 font-bold text-2xl">{workoutData.stats.totalWorkouts} <span className="text-lg text-gray-600">sessions</span></p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-4 border border-emerald-200 shadow-md hover:shadow-lg transition">
                    <p className="text-emerald-600 text-xs font-semibold uppercase mb-1">Total Minutes</p>
                    <p className="text-gray-900 font-bold text-2xl">{workoutData.stats.totalMinutes} <span className="text-lg text-gray-600">min</span></p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-gray-400 text-lg mb-2">🏋️</p>
                  <p className="text-gray-500 font-medium">No workout data available.</p>
                  <p className="text-gray-400 text-sm">Start logging your workouts!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
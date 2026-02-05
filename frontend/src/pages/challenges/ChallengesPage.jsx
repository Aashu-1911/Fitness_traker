import React, { useEffect, useState } from 'react';
import { getDailyChallenge, getWeeklyChallenge, completeChallenge } from '../../api/challengeApi.js';

const ChallengesPage = () => {
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [weeklyChallenge, setWeeklyChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [successAnimation, setSuccessAnimation] = useState(null);

  // Fetch challenges on mount
  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);

    try {
      const [dailyRes, weeklyRes] = await Promise.all([
        getDailyChallenge().catch(err => {
          console.error('Daily challenge fetch error:', err);
          return null;
        }),
        getWeeklyChallenge().catch(err => {
          console.error('Weekly challenge fetch error:', err);
          return null;
        }),
      ]);

      if (dailyRes?.success) {
        setDailyChallenge(dailyRes.challenge);
      }

      if (weeklyRes?.success) {
        setWeeklyChallenge(weeklyRes.challenge);
      }
    } catch (err) {
      console.error('Fetch challenges error:', err);
      setError('Failed to load challenges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChallenge = async (challengeId) => {
    setCompletingId(challengeId);
    setError(null);

    try {
      const response = await completeChallenge(challengeId);

      if (response.success) {
        // Show success animation
        setSuccessAnimation(challengeId);
        
        // Re-fetch challenges to update UI
        await fetchChallenges();

        // Clear success animation after 2 seconds
        setTimeout(() => {
          setSuccessAnimation(null);
        }, 2000);
      }
    } catch (err) {
      console.error('Complete challenge error:', err);
      setError(err.response?.data?.message || 'Failed to complete challenge. Please try again.');
    } finally {
      setCompletingId(null);
    }
  };

  // Get current week number
  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil(diff / oneWeek);
  };

  // Render challenge card
  const renderChallengeCard = (challenge, type) => {
    if (!challenge) {
      return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <div className="text-center text-gray-500">
            <p>No {type} challenge available</p>
          </div>
        </div>
      );
    }

    const isCompleted = challenge.isCompleted;
    const isAnimating = successAnimation === challenge._id;

    return (
      <div className={`bg-white rounded-2xl p-6 border ${type === 'daily' ? 'border-blue-200' : 'border-green-200'} shadow-lg transition-all duration-300 hover:shadow-xl ${isAnimating ? 'scale-105' : ''}`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">
              {type === 'daily' ? '🎯' : '🏆'}
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {type === 'daily' ? 'Daily Challenge' : 'Weekly Challenge'}
              </h3>
              {type === 'weekly' && (
                <p className="text-xs text-gray-600">Week {getCurrentWeek()}</p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-yellow-100 text-yellow-700 border border-yellow-300'}`}>
            {isCompleted ? '✓ Completed' : '⏳ Pending'}
          </span>
        </div>

        {/* Challenge Content */}
        <div className="mb-4">
          <h4 className="text-xl font-bold text-gray-800 mb-2">{challenge.title}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{challenge.description}</p>
        </div>

        {/* Reward */}
        <div className="flex items-center gap-2 mb-4 text-amber-600">
          <span className="text-lg">⭐</span>
          <span className="text-sm font-semibold">{challenge.reward} points</span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleCompleteChallenge(challenge._id)}
          disabled={isCompleted || completingId === challenge._id}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            isCompleted
              ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-300'
              : completingId === challenge._id
              ? 'bg-gray-200 text-gray-600 cursor-wait'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105 hover:shadow-lg active:scale-95'
          }`}
        >
          {completingId === challenge._id ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Completing...</span>
            </>
          ) : isCompleted ? (
            <>
              <span className="text-xl">✓</span>
              <span>Completed</span>
            </>
          ) : (
            <>
              <span>Mark as Completed</span>
            </>
          )}
        </button>

        {/* Success Animation Overlay */}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-100/80 rounded-2xl animate-pulse">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <span className="text-5xl">💪</span>
            Fitness Challenges
          </h1>
          <p className="text-gray-600">Complete challenges to earn points and stay motivated!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="text-red-700">{error}</span>
            </div>
            <button
              onClick={fetchChallenges}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 font-semibold transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                </div>
                <div className="mb-4">
                  <div className="h-6 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Challenges Grid */
          <div className="grid md:grid-cols-2 gap-6">
            {renderChallengeCard(dailyChallenge, 'daily')}
            {renderChallengeCard(weeklyChallenge, 'weekly')}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-green-100 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            How Challenges Work
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">🎯</span>
              <span><strong className="text-gray-800">Daily Challenges</strong> refresh every 24 hours and offer quick wins</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1">🏆</span>
              <span><strong className="text-gray-800">Weekly Challenges</strong> reset every Monday and provide bigger rewards</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-1">⭐</span>
              <span><strong className="text-gray-800">Earn Points</strong> by completing challenges to unlock achievements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-1">📈</span>
              <span><strong className="text-gray-800">Stay Consistent</strong> to build healthy habits and reach your fitness goals</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
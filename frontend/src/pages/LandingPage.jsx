import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Hero Section */}
        <div className="text-center animate-fadeIn">
          {/* Logo/Heading */}
          <div className="mb-8">
            <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-2xl animate-slideDown">
              FitLife
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-1 w-20 bg-white/60 rounded"></div>
              <span className="text-white/90 text-sm font-medium">HEALTH & FITNESS</span>
              <div className="h-1 w-20 bg-white/60 rounded"></div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-3xl md:text-4xl text-white/95 font-semibold mb-4 animate-slideUp">
            Start Your Transformation
          </p>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Track your fitness journey, get personalized recommendations, and achieve your health goals with AI-powered insights.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Feature 1 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:scale-105 transform transition duration-300">
              <div className="text-5xl mb-3">🏋️</div>
              <h3 className="text-white font-bold text-lg mb-2">Custom Workouts</h3>
              <p className="text-white/80 text-sm">
                Get personalized exercise plans based on your goals and fitness level
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:scale-105 transform transition duration-300">
              <div className="text-5xl mb-3">🥗</div>
              <h3 className="text-white font-bold text-lg mb-2">Nutrition Plans</h3>
              <p className="text-white/80 text-sm">
                Receive tailored diet recommendations for weight loss or muscle gain
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:scale-105 transform transition duration-300">
              <div className="text-5xl mb-3">📊</div>
              <h3 className="text-white font-bold text-lg mb-2">Progress Tracking</h3>
              <p className="text-white/80 text-sm">
                Monitor your weight, calories, water intake, and workout stats
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleGetStarted}
            className="px-12 py-4 rounded-full bg-white text-purple-600 font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-110 transform transition duration-300 hover:bg-white/95"
          >
            Get Started Free
          </button>

          {/* Login Link */}
          <p className="text-white/80 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-white font-semibold underline hover:text-white/90 transition"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
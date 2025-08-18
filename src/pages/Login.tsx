import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      login({ id: '1', name: email.split('@')[0], email });
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="pt-20 pb-12 min-h-screen flex items-center">
      <div className="max-w-md mx-auto w-full px-4">
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Sparkles className="h-16 w-16 text-amber-600" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-3xl font-playfair font-bold text-gradient mb-2">
              Welcome Back to Crafshi
            </h1>
            <p className="text-amber-600">
              Sign in to continue your artisan journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-amber-800 font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-amber-800 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-700 custom-cursor"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center custom-cursor">
                <input
                  type="checkbox"
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-amber-700">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-amber-600 hover:text-amber-800 font-medium custom-cursor"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 focus:ring-4 focus:ring-amber-200 transition-all duration-300 hover:scale-105 custom-cursor disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-amber-200"></div>
            <span className="px-4 text-amber-600">or</span>
            <div className="flex-1 border-t border-amber-200"></div>
          </div>

          {/* Demo Account */}
          <div className="text-center space-y-4">
            <p className="text-amber-600">
              Try with demo account:
            </p>
            <button
              onClick={() => {
                setEmail('demo@crafshi.com');
                setPassword('demo123');
              }}
              className="w-full py-3 px-4 border-2 border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 transition-all duration-300 hover:scale-105 custom-cursor"
            >
              Use Demo Account
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-amber-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-amber-800 hover:text-amber-900 font-semibold custom-cursor"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="glass-effect p-4 rounded-xl">
            <div className="text-2xl mb-2">🎨</div>
            <p className="text-amber-700 font-medium">Authentic Crafts</p>
            <p className="text-amber-600 text-sm">Verified artisan work</p>
          </div>
          <div className="glass-effect p-4 rounded-xl">
            <div className="text-2xl mb-2">🚚</div>
            <p className="text-amber-700 font-medium">Free Shipping</p>
            <p className="text-amber-600 text-sm">On orders above ₹10,000</p>
          </div>
          <div className="glass-effect p-4 rounded-xl">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-amber-700 font-medium">Secure Payment</p>
            <p className="text-amber-600 text-sm">100% protected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
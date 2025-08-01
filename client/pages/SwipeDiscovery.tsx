import { Navigation } from '../components/Navigation';
import { EnhancedSwipeJobDiscovery } from '../components/EnhancedSwipeJobDiscovery';
import { motion } from 'framer-motion';
import { Sparkles, Heart, X, RotateCcw } from 'lucide-react';

export default function SwipeDiscovery() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-jobequal-green mr-3 animate-pulse" />
            <span className="text-jobequal-text-muted dark:text-gray-400 font-medium text-lg tracking-wide uppercase">
              Smart Discovery
            </span>
            <Sparkles className="w-6 h-6 text-jobequal-green ml-3 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-jobequal-text dark:text-white mb-4 leading-tight">
            <span className="bg-gradient-to-r from-jobequal-green to-jobequal-teal bg-clip-text text-transparent">
              Swipe Your Way
            </span>
            <br />
            to Your Dream Job
          </h1>
          <p className="text-lg sm:text-xl text-jobequal-text-muted dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover personalized job matches with our intuitive swipe interface.
            Like what you see? Swipe right. Not interested? Swipe left.
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg mb-8"
        >
          <h3 className="font-semibold text-jobequal-text dark:text-white mb-4 text-center">How it works:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-2">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-300">
                <span className="font-semibold">Swipe Left</span><br />
                Not interested
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-300">
                <span className="font-semibold">Swipe Right</span><br />
                Interested!
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                <RotateCcw className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-300">
                <span className="font-semibold">Undo</span><br />
                Changed your mind?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Swipe Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <SwipeJobDiscovery />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-jobequal-text-muted dark:text-gray-400 mb-4">
            Want to see more detailed search options?
          </p>
          <a
            href="/job-search"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Advanced Job Search →
          </a>
        </motion.div>
      </div>
    </main>
  );
}

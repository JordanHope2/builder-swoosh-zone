import { Navigation } from '../components/Navigation';
import { EnhancedSwipeJobDiscovery } from '../components/EnhancedSwipeJobDiscovery';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Zap, Target, TrendingUp } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function SwipeDiscovery() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleControls = useAnimation();
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -30]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  useEffect(() => {
    const sequence = async () => {
      await titleControls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 2, ease: "easeInOut" }
      });
    };
    sequence();
  }, [titleControls]);

  const backgroundFloatingElements = Array.from({ length: 6 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute opacity-10 dark:opacity-5"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [-20, 20, -20],
        x: [-10, 10, -10],
        rotate: [0, 360],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2,
      }}
    >
      {i % 3 === 0 && <Target className="w-8 h-8 text-jobequal-green" />}
      {i % 3 === 1 && <Zap className="w-6 h-6 text-jobequal-blue" />}
      {i % 3 === 2 && <TrendingUp className="w-7 h-7 text-jobequal-teal" />}
    </motion.div>
  ));

  return (
    <main 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundFloatingElements}
      </div>

      {/* Animated Background Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-jobequal-green/5 via-transparent to-jobequal-teal/5"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <Navigation />
      
      <motion.div 
        className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        style={{ opacity }}
      >
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-12"
          style={{ y: y1 }}
        >
          {/* Floating Icons Animation */}
          <div className="relative flex items-center justify-center mb-6">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-16"
            >
              <Sparkles className="w-8 h-8 text-jobequal-green opacity-60" />
            </motion.div>
            
            <motion.span 
              className="relative text-jobequal-text-muted dark:text-gray-400 font-medium text-lg tracking-wider uppercase px-6 py-2 rounded-full border border-jobequal-green/20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="bg-gradient-to-r from-jobequal-green via-jobequal-teal to-jobequal-green bg-clip-text text-transparent bg-[length:200%_auto]"
              >
                {t('swipe.smart_discovery')}
              </motion.span>
            </motion.span>

            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute -right-16"
            >
              <Sparkles className="w-8 h-8 text-jobequal-teal opacity-60" />
            </motion.div>
          </div>

          {/* Enhanced Title */}
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-jobequal-text dark:text-white mb-6 leading-tight"
            animate={titleControls}
          >
            <motion.span 
              className="block bg-gradient-to-r from-jobequal-green via-jobequal-teal to-jobequal-blue bg-clip-text text-transparent bg-[length:200%_auto]"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {t('swipe.title_main')}
            </motion.span>
            <motion.span 
              className="block mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {t('swipe.title_sub')}
            </motion.span>
          </motion.h1>

          {/* Enhanced Subtitle with Typewriter Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="relative"
          >
            <p className="text-lg sm:text-xl text-jobequal-text-muted dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t('swipe.subtitle')}
            </p>
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-jobequal-green rounded-full"
            />
          </motion.div>
        </motion.div>

        {/* Swipe Interface with Enhanced Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            delay: 0.8, 
            duration: 0.8, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          style={{ y: y2 }}
          className="relative"
        >
          {/* Glowing Background Effect */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-jobequal-green/10 via-jobequal-teal/10 to-jobequal-blue/10 rounded-3xl blur-xl"
          />
          
          <div className="relative z-10">
            <EnhancedSwipeJobDiscovery />
          </div>
        </motion.div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center mt-12"
        >
          <motion.p 
            className="text-sm text-jobequal-text-muted dark:text-gray-400 mb-6"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {t('swipe.advanced_search_text')}
          </motion.p>
          
          <motion.a
            href="/job-search"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">{t('swipe.advanced_search_cta')}</span>
            <motion.div
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="group-hover:translate-x-1 transition-transform duration-300"
            >
              <TrendingUp className="w-5 h-5" />
            </motion.div>
          </motion.a>
        </motion.div>
      </motion.div>
    </main>
  );
}

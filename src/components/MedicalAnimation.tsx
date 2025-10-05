import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Pill, 
  Heart, 
  Shield, 
  Zap, 
  Brain,
  Microscope,
  Stethoscope,
  TestTube,
  Atom,
  Sparkles
} from 'lucide-react';

interface MedicalAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
  username?: string;
}

const MedicalAnimation: React.FC<MedicalAnimationProps> = ({ isVisible, onComplete, username }) => {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const phases = [
        { delay: 0, duration: 2000 },
        { delay: 2000, duration: 2000 },
        { delay: 4000, duration: 2000 },
        { delay: 6000, duration: 2000 }
      ];

      phases.forEach((phase, index) => {
        setTimeout(() => {
          setCurrentPhase(index);
        }, phase.delay);
      });

      // Complete animation after all phases
      setTimeout(() => {
        onComplete?.();
      }, 8000);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 z-50 flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Molecules */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`molecule-${i}`}
            className="absolute w-2 h-2 bg-teal-400/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [0, 1, 0],
              rotate: 360
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* DNA Helix Animation */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: currentPhase >= 1 ? 1 : 0,
            scale: currentPhase >= 1 ? 1 : 0,
            rotate: currentPhase >= 1 ? 360 : 0
          }}
          transition={{ duration: 2 }}
        >
          <div className="relative w-full h-full">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-8 bg-gradient-to-b from-teal-400 to-blue-400 rounded-full"
                style={{
                  left: `${50 + 20 * Math.sin(i * 0.5)}%`,
                  top: `${i * 12}%`,
                  transform: `rotate(${i * 45}deg)`
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Floating Pills */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`pill-${i}`}
            className="absolute"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              rotate: 0
            }}
            animate={{ 
              y: -50,
              rotate: 360,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          >
            <Pill className="w-6 h-6 text-blue-400" />
          </motion.div>
        ))}

        {/* Neural Network Lines */}
        {currentPhase >= 2 && (
          <svg className="absolute inset-0 w-full h-full">
            {[...Array(15)].map((_, i) => (
              <motion.line
                key={`line-${i}`}
                x1={Math.random() * window.innerWidth}
                y1={Math.random() * window.innerHeight}
                x2={Math.random() * window.innerWidth}
                y2={Math.random() * window.innerHeight}
                stroke="url(#gradient)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2, delay: i * 0.1 }}
              />
            ))}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Phase 1: Welcome */}
        <AnimatePresence>
          {currentPhase === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="space-y-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Activity className="w-24 h-24 text-teal-400 mx-auto" />
              </motion.div>
              <motion.h1
                className="text-6xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Welcome back, {username || 'Doctor'}!
              </motion.h1>
              <motion.h2
                className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                PolyRisk AI
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Medical Science */}
        <AnimatePresence>
          {currentPhase === 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-8"
            >
              <div className="flex justify-center space-x-8">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                >
                  <Microscope className="w-16 h-16 text-blue-400" />
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <TestTube className="w-16 h-16 text-teal-400" />
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Atom className="w-16 h-16 text-purple-400" />
                </motion.div>
              </div>
              <motion.h3
                className="text-3xl font-semibold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Advanced Medical Science
              </motion.h3>
              <motion.p
                className="text-xl text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Harnessing the power of AI to predict drug interactions and ensure patient safety
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 3: AI Analysis */}
        <AnimatePresence>
          {currentPhase === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="space-y-8"
            >
              <div className="flex justify-center space-x-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                >
                  <Brain className="w-20 h-20 text-pink-400" />
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                >
                  <Zap className="w-20 h-20 text-yellow-400" />
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                >
                  <Sparkles className="w-20 h-20 text-cyan-400" />
                </motion.div>
              </div>
              <motion.h3
                className="text-3xl font-semibold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                AI-Powered Analysis
              </motion.h3>
              <motion.p
                className="text-xl text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Machine learning algorithms analyze 17,430+ drugs and predict potential interactions
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 4: Patient Safety */}
        <AnimatePresence>
          {currentPhase === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="space-y-8"
            >
              <div className="flex justify-center space-x-8">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                >
                  <Heart className="w-20 h-20 text-red-400" />
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Shield className="w-20 h-20 text-green-400" />
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Stethoscope className="w-20 h-20 text-blue-400" />
                </motion.div>
              </div>
              <motion.h3
                className="text-3xl font-semibold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Ensuring Patient Safety
              </motion.h3>
              <motion.p
                className="text-xl text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Real-time risk assessment and clinical recommendations for safer prescriptions
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Indicator */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-teal-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
          <motion.p
            className="text-gray-300 mt-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Initializing your dashboard...
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default MedicalAnimation;

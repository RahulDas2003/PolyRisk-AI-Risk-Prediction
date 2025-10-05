import React from 'react';
import { motion } from 'framer-motion';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password, className = '' }) => {
  const calculateStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    return { score, checks };
  };

  const { score, checks } = calculateStrength(password);
  const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthTextColors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-blue-600', 'text-green-600'];

  const strengthLevel = Math.min(score, 4);
  const strengthPercentage = (score / 5) * 100;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Password Strength</span>
          <span className={`font-medium ${strengthTextColors[strengthLevel]}`}>
            {strengthLevels[strengthLevel]}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full ${strengthColors[strengthLevel]}`}
            initial={{ width: 0 }}
            animate={{ width: `${strengthPercentage}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        {Object.entries(checks).map(([key, passed]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`flex items-center text-xs ${
              passed ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <motion.div
              className={`w-3 h-3 rounded-full mr-2 flex items-center justify-center ${
                passed ? 'bg-green-500' : 'bg-gray-300'
              }`}
              animate={{ scale: passed ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {passed && (
                <motion.svg
                  className="w-2 h-2 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              )}
            </motion.div>
            <span className="capitalize">
              {key === 'length' && 'At least 8 characters'}
              {key === 'lowercase' && 'One lowercase letter'}
              {key === 'uppercase' && 'One uppercase letter'}
              {key === 'numbers' && 'One number'}
              {key === 'symbols' && 'One special character'}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;

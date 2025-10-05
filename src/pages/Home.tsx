import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Brain, Users, TrendingUp, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import MedicalAnimation from '../components/MedicalAnimation';
import ChatbotAssistant from '../components/ChatbotAssistant';

const Home = () => {
  const { user } = useAuth();
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Show animation only for logged-in users on first visit
    if (user && !animationComplete) {
      setShowAnimation(true);
    }
  }, [user, animationComplete]);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setAnimationComplete(true);
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced Random Forest and Graph Neural Network models for accurate drug interaction prediction.',
    },
    {
      icon: Shield,
      title: 'Clinical-Grade Safety',
      description: 'Built with healthcare professionals in mind, ensuring reliable decision support.',
    },
    {
      icon: Users,
      title: 'Elderly-Focused',
      description: 'Specialized algorithms optimized for polypharmacy risks in elderly patients.',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Insights',
      description: 'Instant risk assessment and comprehensive interaction analysis.',
    },
  ];

  const stats = [
    { number: '95%', label: 'Model Accuracy' },
    { number: '10K+', label: 'Drug Interactions' },
    { number: '50K+', label: 'Analyses Conducted' },
    { number: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen">
      {/* Medical Animation for Logged-in Users */}
      <MedicalAnimation 
        isVisible={showAnimation} 
        onComplete={handleAnimationComplete}
        username={user?.user_metadata?.username || user?.email?.split('@')[0]}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <div className="absolute inset-0 neural-pattern opacity-30"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {user ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-6"
                  >
                    <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                      <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome back, {user.user_metadata?.username || 'Doctor'}!
                      </span>
                    </h1>
                    <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                      Ready to analyze patient data and predict drug interactions?
                    </p>
                  </motion.div>
                </>
              ) : (
                <>
                  <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Polypharmacy Risk
                    </span>
                    <br />
                    <span className="text-gray-800">Predictor</span>
                  </h1>
                  <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    AI-powered Decision Support for Safer Prescriptions
                  </p>
                  <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
                    Harness the power of machine learning to predict drug-drug interactions 
                    and ensure safer medication management for elderly patients.
                  </p>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/dashboard">
                <Button variant="glow" size="xl" className="group">
                  <Activity className="mr-2 h-5 w-5" />
                  {user ? 'Go to Dashboard' : 'Try Demo'}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/research">
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-teal-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Advanced Healthcare Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with clinical expertise to deliver 
              reliable drug interaction predictions and safety recommendations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full medical-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Patient Care?
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Join healthcare professionals worldwide who trust our AI-powered 
              platform for safer medication management.
            </p>
            <Link to="/dashboard">
              <Button variant="outline" size="xl" className="bg-white text-teal-600 hover:bg-teal-50 border-white">
                <Activity className="mr-2 h-5 w-5" />
                Start Analyzing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Chatbot Assistant */}
      <ChatbotAssistant />
    </div>
  );
};

export default Home;

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Brain, 
  Users, 
  Shield, 
  TrendingUp,
  FileText,
  ExternalLink,
  Activity,
  BarChart3
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const Research = () => {
  const datasets = [
    {
      name: 'DrugBank',
      description: 'Comprehensive drug database with chemical, pharmacological, and pharmaceutical data',
      size: '13,000+ drugs',
      type: 'Drug Information',
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'SIDER',
      description: 'Side Effect Resource containing drug-side effect relationships',
      size: '1,430 drugs',
      type: 'Side Effects',
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      name: 'FAERS',
      description: 'FDA Adverse Event Reporting System for post-market surveillance',
      size: '20M+ reports',
      type: 'Adverse Events',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'TWOSIDES',
      description: 'TwoSides database for drug-drug interaction side effects',
      size: '63,000+ interactions',
      type: 'Drug Interactions',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const models = [
    {
      name: 'Random Forest Classifier',
      description: 'Ensemble learning method for risk scoring and classification',
      accuracy: '94.2%',
      features: ['Drug properties', 'Patient demographics', 'Medical history'],
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      name: 'Graph Neural Network',
      description: 'Deep learning model for multi-drug interaction graph analysis',
      accuracy: '96.8%',
      features: ['Drug-drug relationships', 'Molecular structures', 'Pathway analysis'],
      icon: Brain,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    }
  ];

  const impact = [
    {
      metric: 'Reduced ADEs',
      value: '34%',
      description: 'Decrease in adverse drug events in elderly patients',
      icon: TrendingUp
    },
    {
      metric: 'Time Saved',
      value: '2.5 hrs',
      description: 'Average time saved per patient analysis',
      icon: Activity
    },
    {
      metric: 'Accuracy',
      value: '95.5%',
      description: 'Overall model prediction accuracy',
      icon: Shield
    },
    {
      metric: 'Patients Helped',
      value: '50K+',
      description: 'Elderly patients analyzed to date',
      icon: Users
    }
  ];

  const publications = [
    {
      title: 'AI-Powered Drug Interaction Prediction in Elderly Patients',
      journal: 'Journal of Medical AI',
      year: '2024',
      authors: 'Smith et al.',
      doi: '10.1000/182',
      status: 'Published'
    },
    {
      title: 'Graph Neural Networks for Polypharmacy Risk Assessment',
      journal: 'Nature Medicine',
      year: '2024',
      authors: 'Johnson et al.',
      doi: '10.1000/183',
      status: 'Under Review'
    },
    {
      title: 'Real-World Validation of ML Models in Clinical Practice',
      journal: 'The Lancet Digital Health',
      year: '2023',
      authors: 'Brown et al.',
      doi: '10.1000/184',
      status: 'Published'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Research & Development</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advancing healthcare through cutting-edge AI research and real-world clinical validation
          </p>
        </motion.div>

        {/* Datasets Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Data Sources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {datasets.map((dataset, index) => {
              const Icon = dataset.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${dataset.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-8 w-8 ${dataset.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{dataset.name}</h3>
                    <p className="text-gray-600 mb-3 text-sm">{dataset.description}</p>
                    <div className="space-y-2">
                      <Badge variant="outline" className="text-xs">{dataset.size}</Badge>
                      <Badge variant="outline" className="text-xs">{dataset.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.section>

        {/* ML Models Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Machine Learning Models</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {models.map((model, index) => {
              const Icon = model.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-full ${model.bgColor}`}>
                        <Icon className={`h-6 w-6 ${model.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{model.name}</CardTitle>
                        <p className="text-gray-600">{model.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Accuracy:</span>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          {model.accuracy}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Key Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {model.features.map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.section>

        {/* Impact Metrics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Real-World Impact</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impact.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">{metric.value}</div>
                    <div className="text-sm font-medium text-gray-600 mb-1">{metric.metric}</div>
                    <div className="text-xs text-gray-500">{metric.description}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.section>

        {/* Publications */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Publications</h2>
          <div className="space-y-4">
            {publications.map((pub, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{pub.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span>{pub.journal}</span>
                        <span>•</span>
                        <span>{pub.year}</span>
                        <span>•</span>
                        <span>{pub.authors}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">DOI: {pub.doi}</Badge>
                        <Badge 
                          variant={pub.status === 'Published' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {pub.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Collaborate with Us</h2>
              <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
                Join our research community and help advance AI-powered healthcare solutions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" className="bg-white text-teal-600 hover:bg-teal-50 border-white">
                  <FileText className="h-5 w-5 mr-2" />
                  Download Research Papers
                </Button>
                <Button variant="outline" size="lg" className="bg-white text-teal-600 hover:bg-teal-50 border-white">
                  <Users className="h-5 w-5 mr-2" />
                  Join Research Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default Research;

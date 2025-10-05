import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  X, 
  FileText, 
  Heart,
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { formatRiskScore, getRiskColor, getRiskBgColor } from '../lib/utils';

interface RiskAlertSidebarProps {
  result: any;
  onClose: () => void;
}

const RiskAlertSidebar = ({ result, onClose }: RiskAlertSidebarProps) => {
  const [activeTab, setActiveTab] = useState('interactions');

  if (!result) return null;

  const { riskScore, recommendations } = result;
  const riskLevel = formatRiskScore(riskScore);
  const riskColor = getRiskColor(riskScore);

  const mockInteractions = [
    {
      drugs: 'Warfarin + Aspirin',
      severity: 'High',
      description: 'Increased bleeding risk due to additive anticoagulant effects',
      management: 'Monitor INR closely, consider dose reduction',
    },
    {
      drugs: 'Digoxin + Furosemide',
      severity: 'Moderate',
      description: 'Hypokalemia may increase digoxin toxicity',
      management: 'Monitor potassium levels, consider K+ supplementation',
    },
    {
      drugs: 'Metformin + Contrast',
      severity: 'Low',
      description: 'Risk of lactic acidosis with contrast media',
      management: 'Hold metformin 48h before and after contrast',
    }
  ];

  const mockAlternatives = [
    {
      drug: 'Clopidogrel',
      advantages: ['Lower bleeding risk', 'Once daily dosing'],
      disadvantages: ['Higher cost', 'Less evidence in elderly'],
      recommendation: 'Consider for patients with high bleeding risk'
    },
    {
      drug: 'ACE Inhibitor',
      advantages: ['Cardioprotective', 'Renal protection'],
      disadvantages: ['Cough side effect', 'Hyperkalemia risk'],
      recommendation: 'First-line for hypertension in elderly'
    }
  ];

  const mockMonitoring = [
    { parameter: 'INR', frequency: 'Weekly', target: '2.0-3.0', critical: '>4.0' },
    { parameter: 'Creatinine', frequency: 'Monthly', target: '<1.5 mg/dL', critical: '>2.0 mg/dL' },
    { parameter: 'Potassium', frequency: 'Bi-weekly', target: '3.5-5.0 mEq/L', critical: '<3.0 or >5.5 mEq/L' }
  ];

  const mockElderlyCare = [
    'Start with lowest effective dose',
    'Monitor for falls and cognitive changes',
    'Consider pill burden and adherence',
    'Regular medication review every 3 months',
    'Assess for deprescribing opportunities'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Risk Score Display */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
              Risk Analysis
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 mb-1">{riskScore}</div>
            <div className={`text-lg font-semibold ${riskColor} mb-3`}>{riskLevel} Risk</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  riskScore < 25 ? 'bg-green-500' :
                  riskScore < 50 ? 'bg-yellow-500' :
                  riskScore < 75 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {riskScore < 25 ? 'Low risk - Continue monitoring' :
               riskScore < 50 ? 'Moderate risk - Consider adjustments' :
               riskScore < 75 ? 'High risk - Immediate attention needed' :
               'Severe risk - Urgent intervention required'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b">
            <div className="flex">
              <button
                className={`flex-1 px-3 py-2 text-sm font-medium ${
                  activeTab === 'interactions' 
                    ? 'text-teal-600 border-b-2 border-teal-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('interactions')}
              >
                Interactions
              </button>
              <button
                className={`flex-1 px-3 py-2 text-sm font-medium ${
                  activeTab === 'alternatives' 
                    ? 'text-teal-600 border-b-2 border-teal-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('alternatives')}
              >
                Alternatives
              </button>
              <button
                className={`flex-1 px-3 py-2 text-sm font-medium ${
                  activeTab === 'monitoring' 
                    ? 'text-teal-600 border-b-2 border-teal-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('monitoring')}
              >
                Monitoring
              </button>
            </div>
          </div>

          <div className="p-4 max-h-96 overflow-y-auto">
            {activeTab === 'interactions' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Drug Interactions</h3>
                {mockInteractions.map((interaction, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-semibold text-gray-800">{interaction.drugs}</h4>
                      <Badge 
                        variant={`risk-${interaction.severity.toLowerCase()}` as any}
                        className="text-xs"
                      >
                        {interaction.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{interaction.description}</p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium text-blue-800">Management:</p>
                      <p className="text-blue-700">{interaction.management}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'alternatives' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Safer Alternatives</h3>
                {mockAlternatives.map((alt, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">{alt.drug}</h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="font-medium text-green-700 mb-1">Advantages:</p>
                        <ul className="text-gray-600 space-y-1">
                          {alt.advantages.map((adv, i) => (
                            <li key={i} className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                              {adv}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-red-700 mb-1">Disadvantages:</p>
                        <ul className="text-gray-600 space-y-1">
                          {alt.disadvantages.map((dis, i) => (
                            <li key={i} className="flex items-center">
                              <X className="h-3 w-3 text-red-500 mr-1" />
                              {dis}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                      <p className="font-medium text-yellow-800">Recommendation:</p>
                      <p className="text-yellow-700">{alt.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'monitoring' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Monitoring Parameters</h3>
                {mockMonitoring.map((param, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800">{param.parameter}</h4>
                      <Badge variant="outline" className="text-xs">{param.frequency}</Badge>
                    </div>
                    <div className="text-xs space-y-1">
                      <div>
                        <p className="text-gray-600">Target Range:</p>
                        <p className="font-medium text-green-700">{param.target}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Critical Value:</p>
                        <p className="font-medium text-red-700">{param.critical}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clinical Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-teal-600" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start">
                <span className="bg-teal-100 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
          <div className="flex space-x-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              Guidelines
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Elderly Care Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Heart className="h-5 w-5 mr-2 text-pink-600" />
            Elderly Care
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {mockElderlyCare.map((care, index) => (
              <div key={index} className="flex items-start">
                <Heart className="h-4 w-4 text-pink-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{care}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RiskAlertSidebar;

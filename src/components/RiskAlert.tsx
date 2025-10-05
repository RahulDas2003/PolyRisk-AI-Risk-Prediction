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
// Tabs components will be defined inline
import { formatRiskScore, getRiskColor, getRiskBgColor } from '../lib/utils';

interface RiskAlertProps {
  result: any;
  onClose: () => void;
}

const RiskAlert = ({ result, onClose }: RiskAlertProps) => {
  const [activeTab, setActiveTab] = useState('interactions');

  if (!result) return null;

  const { riskScore, recommendations } = result;
  const riskLevel = formatRiskScore(riskScore);
  const riskColor = getRiskColor(riskScore);
  const riskBgColor = getRiskBgColor(riskScore);

  const mockInteractions = [
    {
      drugs: 'Warfarin + Aspirin',
      severity: 'High',
      description: 'Increased bleeding risk due to additive anticoagulant effects',
      management: 'Monitor INR closely, consider dose reduction',
      alternatives: ['Clopidogrel', 'Low-dose Aspirin']
    },
    {
      drugs: 'Digoxin + Furosemide',
      severity: 'Moderate',
      description: 'Hypokalemia may increase digoxin toxicity',
      management: 'Monitor potassium levels, consider K+ supplementation',
      alternatives: ['ACE Inhibitor', 'Thiazide diuretic']
    },
    {
      drugs: 'Metformin + Contrast',
      severity: 'Low',
      description: 'Risk of lactic acidosis with contrast media',
      management: 'Hold metformin 48h before and after contrast',
      alternatives: ['Sulfonylurea', 'Insulin therapy']
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
    { parameter: 'Potassium', frequency: 'Bi-weekly', target: '3.5-5.0 mEq/L', critical: '<3.0 or >5.5 mEq/L' },
    { parameter: 'Liver Enzymes', frequency: 'Monthly', target: 'Normal', critical: '3x ULN' }
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${riskBgColor}`}>
              <AlertTriangle className={`h-6 w-6 ${riskColor}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Risk Analysis Report</h2>
              <p className="text-gray-600">AI-generated safety assessment</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Risk Score Display */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-800 mb-2">{riskScore}</div>
            <div className={`text-2xl font-semibold ${riskColor} mb-2`}>{riskLevel} Risk</div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  riskScore < 25 ? 'bg-green-500' :
                  riskScore < 50 ? 'bg-yellow-500' :
                  riskScore < 75 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
            <p className="text-gray-600">
              {riskScore < 25 ? 'Low risk - Continue monitoring' :
               riskScore < 50 ? 'Moderate risk - Consider adjustments' :
               riskScore < 75 ? 'High risk - Immediate attention needed' :
               'Severe risk - Urgent intervention required'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="interactions">Interactions</TabsTrigger>
              <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="elderly">Elderly Care</TabsTrigger>
            </TabsList>

            <TabsContent value="interactions" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Drug-Drug Interactions</h3>
                {mockInteractions.map((interaction, index) => (
                  <Card key={index} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{interaction.drugs}</h4>
                        <Badge 
                          variant={`risk-${interaction.severity.toLowerCase()}` as any}
                          className="risk"
                        >
                          {interaction.severity}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{interaction.description}</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-1">Management:</p>
                        <p className="text-sm text-blue-700">{interaction.management}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="alternatives" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Safer Alternatives</h3>
                {mockAlternatives.map((alt, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">{alt.drug}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-green-700 mb-2">Advantages:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {alt.advantages.map((adv, i) => (
                              <li key={i} className="flex items-center">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                {adv}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-700 mb-2">Disadvantages:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {alt.disadvantages.map((dis, i) => (
                              <li key={i} className="flex items-center">
                                <X className="h-3 w-3 text-red-500 mr-2" />
                                {dis}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">Recommendation:</p>
                        <p className="text-sm text-yellow-700">{alt.recommendation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Monitoring Parameters</h3>
                <div className="grid gap-4">
                  {mockMonitoring.map((param, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">{param.parameter}</h4>
                          <Badge variant="outline">{param.frequency}</Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Target Range:</p>
                            <p className="font-medium text-green-700">{param.target}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Critical Value:</p>
                            <p className="font-medium text-red-700">{param.critical}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="elderly" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Elderly-Specific Recommendations</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {mockElderlyCare.map((care, index) => (
                        <div key={index} className="flex items-start">
                          <Heart className="h-5 w-5 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{care}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Clinical Recommendations */}
        <div className="p-6 bg-gray-50 border-t">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-teal-600">
                <FileText className="h-5 w-5 mr-2" />
                Clinical Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-3 mt-6">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Guidelines
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Tabs component (simplified version)
const Tabs = ({ value, onValueChange, children }: any) => {
  return (
    <div className="w-full">
      {React.Children.map(children, child => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { value, onValueChange });
        }
        if (child.type === TabsContent && child.props.value === value) {
          return child;
        }
        return null;
      })}
    </div>
  );
};

const TabsList = ({ children, value, onValueChange }: any) => {
  return (
    <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600">
      {React.Children.map(children, child => 
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
};

const TabsTrigger = ({ value, onValueChange, children, ...props }: any) => {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        value === props.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
      }`}
      onClick={() => onValueChange(props.value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, ...props }: any) => {
  return <div {...props}>{children}</div>;
};

export default RiskAlert;

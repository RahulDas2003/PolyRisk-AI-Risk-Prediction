import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain,
  Loader2,
  AlertTriangle,
  Activity,
  Heart,
  Pill
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface IntegratedAIAnalysisProps {
  analysisResult?: any;
  showAnalysis?: boolean;
}

interface GeminiAnalysisData {
  patient_name: string;
  age: number;
  base_risk_score?: number;
  risk_summary: {
    overall_risk_score: string;
    risk_level: string;
    notes: string;
    scoring_breakdown?: {
      age_contribution: string;
      kidney_contribution: string;
      liver_contribution: string;
      drug_interactions: string;
      organ_effects: string;
      polypharmacy: string;
    };
  };
  drug_analysis: Array<{
    name: string;
    category?: string;
    interaction_risks: Array<{
      drug: string;
      interaction: string;
      risk_score: number;
      clinical_impact?: string;
    }>;
    side_effects: Array<{
      effect: string;
      severity: string;
      frequency: string;
    }> | string[];
    organs_affected: Array<{
      organ: string;
      effect: string;
      severity: string;
    }> | string[];
    individual_risk_score: string;
    risk_contribution?: string;
  }>;
  drug_alternatives: Array<{
    original_drug: string;
    alternatives: Array<{
      alternative_name: string;
      advantages: string[];
      disadvantages: string[];
      dosing_recommendation: string;
      monitoring_parameters: string[];
      risk_reduction?: string;
    }>;
  }>;
  clinical_recommendations: string[];
}

const IntegratedAIAnalysis: React.FC<IntegratedAIAnalysisProps> = ({ 
  analysisResult, 
  showAnalysis 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [geminiData, setGeminiData] = useState<GeminiAnalysisData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'alternatives' | 'monitoring'>('overview');

  useEffect(() => {
    if (analysisResult && showAnalysis) {
      setIsLoading(true);
      
      try {
        // Handle the actual response format from backend
        if (analysisResult.geminiAnalysis) {
          const geminiResult = analysisResult.geminiAnalysis;
          
          // Check if we have the analysis data directly
          if (geminiResult.analysis) {
            if (geminiResult.analysis.raw_text) {
              // Try to parse the raw_text which contains the JSON
              try {
                const jsonMatch = geminiResult.analysis.raw_text.match(/```json\s*([\s\S]*?)\s*```/);
                if (jsonMatch) {
                  const parsed = JSON.parse(jsonMatch[1]);
                  setGeminiData(parsed);
                } else {
                  // If no code block, try to parse the entire raw_text
                  const parsed = JSON.parse(geminiResult.analysis.raw_text);
                  setGeminiData(parsed);
                }
              } catch (e) {
                console.warn('Could not parse Gemini result as JSON:', e);
                // Set a fallback structure
                setGeminiData({
                  patient_name: geminiResult.patient_name || 'Unknown',
                  age: 0,
                  risk_summary: {
                    overall_risk_score: 'N/A',
                    risk_level: 'Unknown',
                    notes: 'Analysis data could not be parsed properly.'
                  },
                  drug_analysis: [],
                  drug_alternatives: [],
                  clinical_recommendations: []
                });
              }
            } else {
              // Direct analysis object
              setGeminiData(geminiResult.analysis);
            }
          }
        }
      } catch (error) {
        console.error('Error processing analysis result:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [analysisResult, showAnalysis]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!showAnalysis) {
    return (
      <Card className="shadow-md border-0">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
            <Brain className="h-10 w-10 text-teal-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis Report</h3>
          <p className="text-gray-600 leading-relaxed">
            Fill in patient information and click "Analyze Drug Interactions" to get comprehensive AI-powered analysis including drug interactions, alternatives, and monitoring recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="shadow-md border-0">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Analysis in Progress</h3>
          <p className="text-gray-600">Analyzing patient data with advanced AI models...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
            <Brain className="h-6 w-6 mr-3 text-purple-600" />
            AI Analysis Report
          </CardTitle>
          <p className="text-gray-600">
            Comprehensive AI-powered analysis of patient data and medication interactions
          </p>
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'interactions', label: 'Interactions', icon: AlertTriangle },
          { id: 'alternatives', label: 'Alternatives', icon: Pill },
          { id: 'monitoring', label: 'Monitoring', icon: Heart }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center ${
              activeTab === id
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-gray-600 hover:text-teal-600'
            }`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">AI Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {geminiData ? (
              <>
                {/* Risk Summary */}
                <div className={`p-4 rounded-lg border ${getRiskColor(geminiData.risk_summary.risk_level)}`}>
                  <h3 className="text-lg font-bold mb-2">Risk Assessment</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Overall Risk Score:</span>
                      <span className="font-bold">{geminiData.risk_summary.overall_risk_score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <Badge className={getRiskColor(geminiData.risk_summary.risk_level)}>
                        {geminiData.risk_summary.risk_level.toUpperCase()}
                      </Badge>
                    </div>
                    {geminiData.base_risk_score && (
                      <div className="flex justify-between">
                        <span>Base Risk Score:</span>
                        <span className="font-medium">{geminiData.base_risk_score}/10</span>
                      </div>
                    )}
                    {geminiData.risk_summary.scoring_breakdown && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <h4 className="font-semibold text-sm mb-2">Scoring Breakdown:</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>Age: {geminiData.risk_summary.scoring_breakdown.age_contribution}</div>
                          <div>Kidney: {geminiData.risk_summary.scoring_breakdown.kidney_contribution}</div>
                          <div>Liver: {geminiData.risk_summary.scoring_breakdown.liver_contribution}</div>
                          <div>Interactions: {geminiData.risk_summary.scoring_breakdown.drug_interactions}</div>
                          <div>Organ Effects: {geminiData.risk_summary.scoring_breakdown.organ_effects}</div>
                          <div>Polypharmacy: {geminiData.risk_summary.scoring_breakdown.polypharmacy}</div>
                        </div>
                      </div>
                    )}
                    <p className="text-sm mt-2">{geminiData.risk_summary.notes}</p>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Patient: {geminiData.patient_name}</h3>
                  <p className="text-sm text-gray-600">Age: {geminiData.age} years</p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Analysis Pending</h3>
                <p className="text-gray-600">AI analysis results will appear here once processing is complete.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'interactions' && (
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Drug Interactions Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {geminiData && geminiData.drug_analysis ? (
              <div className="space-y-4">
                {geminiData.drug_analysis.map((drug, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{drug.name}</h4>
                      {drug.category && (
                        <Badge variant="outline" className="text-xs">
                          {drug.category}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Individual Risk Score:</span>
                        <span className="font-medium">{drug.individual_risk_score}</span>
                      </div>
                      {drug.risk_contribution && (
                        <div>
                          <span className="font-medium">Risk Contribution:</span>
                          <p className="text-sm text-gray-600">{drug.risk_contribution}</p>
                        </div>
                      )}
                      {drug.interaction_risks && drug.interaction_risks.length > 0 && (
                        <div>
                          <span className="font-medium">Drug Interactions:</span>
                          <div className="mt-1 space-y-1">
                            {drug.interaction_risks.map((interaction, intIdx) => (
                              <div key={intIdx} className="text-sm bg-yellow-50 p-2 rounded">
                                <div className="font-medium">With {interaction.drug} (Risk: {interaction.risk_score}/100)</div>
                                <div className="text-gray-600">{interaction.interaction}</div>
                                {interaction.clinical_impact && (
                                  <div className="text-xs text-red-600 mt-1">{interaction.clinical_impact}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {drug.side_effects && drug.side_effects.length > 0 && (
                        <div>
                          <span className="font-medium">Side Effects:</span>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {drug.side_effects.map((effect, idx) => {
                              // Handle both string and object formats
                              if (typeof effect === 'string') {
                                return <li key={idx}>{effect}</li>;
                              } else {
                                return (
                                  <li key={idx}>
                                    <strong>{effect.effect}</strong> ({effect.severity}, {effect.frequency})
                                  </li>
                                );
                              }
                            })}
                          </ul>
                        </div>
                      )}
                      {drug.organs_affected && drug.organs_affected.length > 0 && (
                        <div>
                          <span className="font-medium">Organs Affected:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {drug.organs_affected.map((organ, idx) => {
                              // Handle both string and object formats
                              if (typeof organ === 'string') {
                                return (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {organ}
                                  </Badge>
                                );
                              } else {
                                return (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {organ.organ} ({organ.severity})
                                  </Badge>
                                );
                              }
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-600">Drug interaction analysis will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'alternatives' && (
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Drug Alternatives</CardTitle>
          </CardHeader>
          <CardContent>
            {geminiData && geminiData.drug_alternatives ? (
              <div className="space-y-4">
                {geminiData.drug_alternatives.map((alt, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Alternatives for {alt.original_drug}</h4>
                    <div className="space-y-3">
                      {alt.alternatives.map((alternative, altIdx) => (
                        <div key={altIdx} className="bg-gray-50 p-3 rounded">
                          <h5 className="font-medium text-gray-800">{alternative.alternative_name}</h5>
                          <div className="space-y-2 mt-2">
                            <div>
                              <span className="font-medium text-green-600">Advantages:</span>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {alternative.advantages.map((adv, advIdx) => (
                                  <li key={advIdx}>{adv}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="font-medium text-red-600">Disadvantages:</span>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {alternative.disadvantages.map((dis, disIdx) => (
                                  <li key={disIdx}>{dis}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="font-medium">Dosing Recommendation:</span>
                              <p className="text-sm text-gray-600">{alternative.dosing_recommendation}</p>
                            </div>
                            <div>
                              <span className="font-medium">Monitoring Parameters:</span>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {alternative.monitoring_parameters.map((param, paramIdx) => (
                                  <li key={paramIdx}>{param}</li>
                                ))}
                              </ul>
                            </div>
                            {alternative.risk_reduction && (
                              <div>
                                <span className="font-medium text-green-600">Risk Reduction:</span>
                                <p className="text-sm text-gray-600">{alternative.risk_reduction}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Pill className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Alternative drug recommendations will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'monitoring' && (
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Monitoring Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            {geminiData && geminiData.clinical_recommendations ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Clinical Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {geminiData.clinical_recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">Monitoring recommendations will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default IntegratedAIAnalysis;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Activity, 
  Pill, 
  Plus, 
  AlertTriangle,
  Search,
  Trash2,
  Loader2,
  Code,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  searchDrugBankDrugs, 
  initializeDrugBankDatabase, 
  DrugBankDrug,
  getDrugBankDatabaseStats
} from '../lib/drugbankFilteredDatabase';
import { 
  extractPatientDataJSON, 
  performRealTimeAnalysis, 
  exportPatientDataJSON,
  ExtractedPatientData,
  RealTimeAnalysis
} from '../lib/patientDataExtractor';
import { 
  saveAllPatientDataToAPI 
} from '../lib/patientDataAPI';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  category: string;
}

interface PatientData {
  name: string;
  age: number;
  gender: string;
  kidneyFunction: string;
  liverFunction: string;
  medications: Medication[];
  geminiAnalysis?: any;
}

const PatientForm = ({ onAnalyze }: { onAnalyze: (data: PatientData) => void }) => {
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: 0,
    gender: '',
    kidneyFunction: '',
    liverFunction: '',
    medications: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showDrugSearch, setShowDrugSearch] = useState(false);
  const [isLoadingDrugs, setIsLoadingDrugs] = useState(false);
  const [filteredDrugs, setFilteredDrugs] = useState<DrugBankDrug[]>([]);
  const [isDatabaseLoaded, setIsDatabaseLoaded] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedPatientData | null>(null);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState<RealTimeAnalysis | null>(null);
  const [showJSONOutput, setShowJSONOutput] = useState(false);
  const [apiSaveStatus, setApiSaveStatus] = useState<string>('');

  // Initialize drug database and recover saved data
  useEffect(() => {
    const loadDatabase = async () => {
      setIsLoadingDrugs(true);
      try {
        const success = await initializeDrugBankDatabase();
        setIsDatabaseLoaded(success);
      } catch (error) {
        console.error('Failed to load DrugBank database:', error);
        setIsDatabaseLoaded(false);
      } finally {
        setIsLoadingDrugs(false);
      }
    };
    loadDatabase();
    
    // Recover saved data from localStorage
    try {
      const savedPatientData = localStorage.getItem('patientData');
      const savedExtractedData = localStorage.getItem('extractedPatientData');
      const savedAnalysis = localStorage.getItem('realTimeAnalysis');
      
      if (savedPatientData) {
        const parsedData = JSON.parse(savedPatientData);
        setPatientData(parsedData);
        console.log('🔄 Recovered Patient Data:', parsedData);
      }
      
      if (savedExtractedData) {
        const parsedExtracted = JSON.parse(savedExtractedData);
        setExtractedData(parsedExtracted);
        console.log('📊 Recovered Extracted Data:', parsedExtracted);
      }
      
      if (savedAnalysis) {
        const parsedAnalysis = JSON.parse(savedAnalysis);
        setRealTimeAnalysis(parsedAnalysis);
        console.log('⚡ Recovered Analysis:', parsedAnalysis);
      }
    } catch (error) {
      console.error('Error recovering saved data:', error);
    }
  }, []);

  // Search drugs when search term changes
  useEffect(() => {
    if (searchTerm.length >= 2 && isDatabaseLoaded) {
      const results = searchDrugBankDrugs(searchTerm, { limit: 20 });
      setFilteredDrugs(results);
    } else {
      setFilteredDrugs([]);
    }
  }, [searchTerm, isDatabaseLoaded]);

  // Real-time analysis display (without saving to backend)
  useEffect(() => {
    if (patientData.name || patientData.age > 0 || patientData.gender || patientData.medications.length > 0) {
      try {
        const extracted = extractPatientDataJSON(patientData);
        const analysis = performRealTimeAnalysis(extracted);
        setExtractedData(extracted);
        setRealTimeAnalysis(analysis);
        
        // Only save to localStorage for UI persistence (not backend)
        localStorage.setItem('patientData', JSON.stringify(patientData));
        localStorage.setItem('extractedPatientData', JSON.stringify(extracted));
        localStorage.setItem('realTimeAnalysis', JSON.stringify(analysis));
        
        // Log to console for debugging (no backend save)
        console.log('🔄 Patient Data Updated (UI only):', patientData);
        console.log('📊 Extracted JSON (UI only):', extracted);
        console.log('⚡ Real-time Analysis (UI only):', analysis);
        
      } catch (error) {
        console.error('Error extracting patient data:', error);
      }
    }
  }, [patientData]);

  const addMedication = (drug: DrugBankDrug) => {
    const newMedication: Medication = {
      id: drug.id,
      name: drug.name,
      dosage: '10mg',
      frequency: 'Once daily',
      category: 'Unknown' // DrugBank filtered doesn't have categories
    };
    
    setPatientData(prev => ({
      ...prev,
      medications: [...prev.medications, newMedication]
    }));
    setSearchTerm('');
    setShowDrugSearch(false);
  };

  const removeMedication = (id: string) => {
    setPatientData(prev => ({
      ...prev,
      medications: prev.medications.filter(med => med.id !== id)
    }));
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setPatientData(prev => ({
      ...prev,
      medications: prev.medications.map(med =>
        med.id === id ? { ...med, [field]: value } : med
      )
    }));
  };

  // Save data to backend API
  const saveToBackendAPI = async (patientData: any, extractedData: any, analysis: any) => {
    setIsSavingToAPI(true);
    setApiSaveStatus('Saving to server...');
    
    try {
      // Save all data to backend
      const result = await saveAllPatientDataToAPI(patientData, extractedData, analysis);
      
      if (result.success) {
        setApiSaveStatus('✅ Saved to server successfully');
        console.log('✅ All patient data saved to backend:', result);
      } else {
        setApiSaveStatus(`❌ Save failed: ${result.message}`);
        console.error('❌ Failed to save to backend:', result);
      }
    } catch (error) {
      setApiSaveStatus(`❌ API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('❌ API save error:', error);
    } finally {
      setIsSavingToAPI(false);
      // Clear status after 3 seconds
      setTimeout(() => setApiSaveStatus(''), 3000);
    }
  };

  const handleSubmit = async () => {
    if (patientData.name && patientData.age > 0 && patientData.gender && patientData.medications.length > 0) {
      // Extract and analyze data
      const extracted = extractPatientDataJSON(patientData);
      const analysis = performRealTimeAnalysis(extracted);
      
      // Save to backend API only when analyze button is clicked
      await saveToBackendAPI(patientData, extracted, analysis);
      
      // Call Gemini AI analysis
      try {
        const geminiResponse = await fetch('http://localhost:8000/analyze_patient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (geminiResponse.ok) {
          const geminiResult = await geminiResponse.json();
          console.log('Gemini AI Analysis:', geminiResult);
          
          // Pass both the original analysis and Gemini AI result
          onAnalyze({
            ...patientData,
            geminiAnalysis: geminiResult
          });
        } else {
          console.error('Gemini AI analysis failed:', geminiResponse.status);
          // Fallback to original analysis
          onAnalyze(patientData);
        }
      } catch (error) {
        console.error('Error calling Gemini AI:', error);
        // Fallback to original analysis
        onAnalyze(patientData);
      }
    }
  };

  const isPolypharmacy = patientData.medications.length >= 5;

  return (
    <Card className="h-fit shadow-md border-0">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center text-teal-600 text-lg">
          <User className="h-5 w-5 mr-2" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Patient Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter patient name"
            value={patientData.name}
            onChange={(e) => setPatientData(prev => ({ ...prev, name: e.target.value }))}
            className="h-11"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="65"
              value={patientData.age || ''}
              onChange={(e) => setPatientData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
            <select
              id="gender"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={patientData.gender}
              onChange={(e) => setPatientData(prev => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Organ Function */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="kidney" className="text-sm font-medium">Kidney Function</Label>
            <select
              id="kidney"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={patientData.kidneyFunction}
              onChange={(e) => setPatientData(prev => ({ ...prev, kidneyFunction: e.target.value }))}
            >
              <option value="">Select</option>
              <option value="normal">Normal</option>
              <option value="mild">Mild Impairment</option>
              <option value="moderate">Moderate Impairment</option>
              <option value="severe">Severe Impairment</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="liver" className="text-sm font-medium">Liver Function</Label>
            <select
              id="liver"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={patientData.liverFunction}
              onChange={(e) => setPatientData(prev => ({ ...prev, liverFunction: e.target.value }))}
            >
              <option value="">Select</option>
              <option value="normal">Normal</option>
              <option value="mild">Mild Impairment</option>
              <option value="moderate">Moderate Impairment</option>
              <option value="severe">Severe Impairment</option>
            </select>
          </div>
        </div>

        {/* Medications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Current Medications</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDrugSearch(!showDrugSearch)}
              className="h-9"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Drug
            </Button>
          </div>

            {/* Drug Search */}
            {showDrugSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 border rounded-lg bg-gray-50"
              >
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={isDatabaseLoaded ? "Search from 17,430+ drugs..." : "Loading DrugBank database..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    disabled={!isDatabaseLoaded}
                  />
                    {isLoadingDrugs && (
                      <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>
                  
                  {/* Database Stats */}
                  {isDatabaseLoaded && (
                    <div className="text-xs text-gray-500 text-center">
                      {getDrugBankDatabaseStats().totalDrugs.toLocaleString()} drugs available from DrugBank
                    </div>
                  )}
                </div>
                {searchTerm && isDatabaseLoaded && (
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    {filteredDrugs.length > 0 ? (
                      filteredDrugs.map((drug, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 hover:bg-gray-100 rounded cursor-pointer border border-gray-200 hover:border-teal-300 transition-colors"
                          onClick={() => addMedication(drug)}
                        >
                          <div className="flex items-center flex-1">
                            <Pill className="h-4 w-4 mr-3 text-teal-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 truncate">{drug.name}</span>
                                <Badge variant="outline" className="text-xs flex-shrink-0">
                                  DrugBank
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">ID: {drug.drugBankId}</p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-blue-600 font-medium">
                                  📋 DrugBank Database
                                </span>
                              </div>
                            </div>
                          </div>
                          <Plus className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        No drugs found. Try a different search term.
                      </div>
                    )}
                  </div>
                )}
                {!isDatabaseLoaded && (
                  <div className="mt-2 p-2 text-sm text-gray-500 text-center">
                    Loading DrugBank filtered database (17,430+ drugs)...
                  </div>
                )}
              </motion.div>
            )}

          {/* Medication List */}
          <div className="space-y-3">
            {patientData.medications.map((medication) => (
              <motion.div
                key={medication.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center space-x-3 p-4 bg-white border rounded-lg shadow-sm"
              >
                <Pill className="h-4 w-4 text-teal-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{medication.name}</p>
                  <div className="flex space-x-2 mt-2">
                    <select
                      value={medication.dosage}
                      onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                      className="text-xs border rounded px-3 py-1.5 h-8"
                    >
                      <option value="5mg">5mg</option>
                      <option value="10mg">10mg</option>
                      <option value="20mg">20mg</option>
                      <option value="50mg">50mg</option>
                    </select>
                    <select
                      value={medication.frequency}
                      onChange={(e) => updateMedication(medication.id, 'frequency', e.target.value)}
                      className="text-xs border rounded px-3 py-1.5 h-8"
                    >
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="As needed">As needed</option>
                    </select>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMedication(medication.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Polypharmacy Alert */}
          {isPolypharmacy && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
            >
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-3" />
                <span className="text-sm font-medium text-orange-800">
                  Polypharmacy Risk Detected ({patientData.medications.length} drugs)
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Real-time Analysis Display */}
        {realTimeAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-blue-800 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Real-time Analysis (Preview Only)
              </h4>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowJSONOutput(!showJSONOutput)}
                >
                  {showJSONOutput ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {showJSONOutput ? 'Hide' : 'Show'} JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const jsonData = exportPatientDataJSON(patientData);
                    navigator.clipboard.writeText(jsonData);
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Copy JSON
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Confidence Score:</span>
                <Badge className={`${realTimeAnalysis.confidence_score >= 80 ? 'bg-green-100 text-green-800' : realTimeAnalysis.confidence_score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {realTimeAnalysis.confidence_score}%
                </Badge>
              </div>
              
              {/* API Save Status */}
              {apiSaveStatus && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server Status:</span>
                  <span className={`text-xs ${apiSaveStatus.includes('✅') ? 'text-green-600' : apiSaveStatus.includes('❌') ? 'text-red-600' : 'text-blue-600'}`}>
                    {apiSaveStatus}
                  </span>
                </div>
              )}
              
              {/* Data Save Info */}
              {!apiSaveStatus && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data Status:</span>
                  <span className="text-xs text-gray-500">
                    Preview only - Click "Analyze Drug Interactions" to save
                  </span>
                </div>
              )}
              
              {realTimeAnalysis.risk_indicators.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-red-700">Risk Indicators:</span>
                  <ul className="text-xs text-red-600 mt-1">
                    {realTimeAnalysis.risk_indicators.map((indicator, index) => (
                      <li key={index}>• {indicator}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {realTimeAnalysis.clinical_alerts.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-orange-700">Clinical Alerts:</span>
                  <ul className="text-xs text-orange-600 mt-1">
                    {realTimeAnalysis.clinical_alerts.map((alert, index) => (
                      <li key={index}>• {alert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* JSON Output Display */}
        {showJSONOutput && extractedData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800 flex items-center">
                <Code className="h-4 w-4 mr-2" />
                Extracted JSON Data
              </h4>
              <Badge variant="outline" className="text-xs">
                Auto-generated
              </Badge>
            </div>
            <pre className="text-xs bg-white p-3 rounded border overflow-x-auto max-h-60">
              {JSON.stringify(extractedData, null, 2)}
            </pre>
          </motion.div>
        )}

        {/* Analyze Button */}
        <Button
          variant="glow"
          className="w-full h-12 text-base font-medium"
          onClick={handleSubmit}
          disabled={!patientData.name || patientData.age === 0 || !patientData.gender || patientData.medications.length === 0}
        >
          <Activity className="h-5 w-5 mr-2" />
          Analyze Drug Interactions
        </Button>
      </CardContent>
    </Card>
  );
};

export default PatientForm;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface GeminiConfigProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const GeminiConfig = ({ onApiKeySet, currentApiKey }: GeminiConfigProps) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setValidationStatus('invalid');
      return;
    }

    setIsValidating(true);
    setValidationStatus('validating');

    try {
      // Test the API key by making a simple request
      const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Test'
            }]
          }]
        })
      });

      if (testResponse.ok) {
        setValidationStatus('valid');
        onApiKeySet(apiKey);
        // Store in localStorage for persistence
        localStorage.setItem('gemini_api_key', apiKey);
      } else {
        setValidationStatus('invalid');
      }
    } catch (error) {
      console.error('API key validation failed:', error);
      setValidationStatus('invalid');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearApiKey = () => {
    setApiKey('');
    setValidationStatus('idle');
    localStorage.removeItem('gemini_api_key');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="h-5 w-5 mr-2 text-purple-600" />
          Gemini AI Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="apiKey">Gemini API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={`pr-10 ${
                  validationStatus === 'invalid' ? 'border-red-500' : 
                  validationStatus === 'valid' ? 'border-green-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {validationStatus === 'invalid' && (
              <p className="text-red-600 text-xs mt-1">Invalid API key. Please check and try again.</p>
            )}
          </div>

          <div className="space-y-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isValidating || !apiKey.trim()}
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Validating...
                </>
              ) : validationStatus === 'valid' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  API Key Valid
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Validate API Key
                </>
              )}
            </Button>

            {validationStatus === 'valid' && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleClearApiKey}
              >
                Clear API Key
              </Button>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">How to get your Gemini API key:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                  <li>Sign in with your Google account</li>
                  <li>Click "Create API Key"</li>
                  <li>Copy the generated key and paste it above</li>
                </ol>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GeminiConfig;

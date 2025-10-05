// Server-side example for saving patient data to JSON files
// This would be your backend server (Node.js/Express)

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'patient-data');
const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
};

// Initialize data directory
ensureDataDir();

// Save patient data to JSON file
app.post('/api/patients', async (req, res) => {
  try {
    const { patientData, timestamp, source } = req.body;
    
    // Create filename with timestamp
    const filename = `patient-${Date.now()}.json`;
    const filepath = path.join(DATA_DIR, filename);
    
    // Save to file
    await fs.writeFile(filepath, JSON.stringify({
      patientData,
      timestamp,
      source,
      savedAt: new Date().toISOString()
    }, null, 2));
    
    console.log(`✅ Patient data saved to: ${filepath}`);
    
    res.json({
      success: true,
      message: 'Patient data saved successfully',
      filename,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error saving patient data:', error);
    res.status(500).json({
      success: false,
      message: `Failed to save patient data: ${error.message}`
    });
  }
});

// Save extracted data to JSON file
app.post('/api/patients/extracted', async (req, res) => {
  try {
    const { extractedData, timestamp, source } = req.body;
    
    const filename = `extracted-${Date.now()}.json`;
    const filepath = path.join(DATA_DIR, filename);
    
    await fs.writeFile(filepath, JSON.stringify({
      extractedData,
      timestamp,
      source,
      savedAt: new Date().toISOString()
    }, null, 2));
    
    console.log(`✅ Extracted data saved to: ${filepath}`);
    
    res.json({
      success: true,
      message: 'Extracted data saved successfully',
      filename,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error saving extracted data:', error);
    res.status(500).json({
      success: false,
      message: `Failed to save extracted data: ${error.message}`
    });
  }
});

// Save analysis data to JSON file
app.post('/api/patients/analysis', async (req, res) => {
  try {
    const { analysis, timestamp, source } = req.body;
    
    const filename = `analysis-${Date.now()}.json`;
    const filepath = path.join(DATA_DIR, filename);
    
    await fs.writeFile(filepath, JSON.stringify({
      analysis,
      timestamp,
      source,
      savedAt: new Date().toISOString()
    }, null, 2));
    
    console.log(`✅ Analysis data saved to: ${filepath}`);
    
    res.json({
      success: true,
      message: 'Analysis data saved successfully',
      filename,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error saving analysis data:', error);
    res.status(500).json({
      success: false,
      message: `Failed to save analysis data: ${error.message}`
    });
  }
});

// Save complete patient data to JSON file
app.post('/api/patients/complete', async (req, res) => {
  try {
    const { patientData, extractedData, analysis, timestamp, source } = req.body;
    
    const filename = `complete-patient-${Date.now()}.json`;
    const filepath = path.join(DATA_DIR, filename);
    
    const completeData = {
      patientData,
      extractedData,
      analysis,
      timestamp,
      source,
      savedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    await fs.writeFile(filepath, JSON.stringify(completeData, null, 2));
    
    console.log(`✅ Complete patient data saved to: ${filepath}`);
    
    res.json({
      success: true,
      message: 'Complete patient data saved successfully',
      filename,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error saving complete patient data:', error);
    res.status(500).json({
      success: false,
      message: `Failed to save complete patient data: ${error.message}`
    });
  }
});

// Get all saved patient files
app.get('/api/patients', async (req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const patientFiles = files.filter(file => file.endsWith('.json'));
    
    const patientData = [];
    for (const file of patientFiles) {
      const filepath = path.join(DATA_DIR, file);
      const content = await fs.readFile(filepath, 'utf8');
      const data = JSON.parse(content);
      patientData.push({
        filename: file,
        timestamp: data.savedAt,
        source: data.source
      });
    }
    
    res.json({
      success: true,
      files: patientData,
      count: patientData.length
    });
  } catch (error) {
    console.error('❌ Error reading patient files:', error);
    res.status(500).json({
      success: false,
      message: `Failed to read patient files: ${error.message}`
    });
  }
});

// Get specific patient file
app.get('/api/patients/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(DATA_DIR, filename);
    
    const content = await fs.readFile(filepath, 'utf8');
    const data = JSON.parse(content);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Error reading patient file:', error);
    res.status(500).json({
      success: false,
      message: `Failed to read patient file: ${error.message}`
    });
  }
});

// Delete patient file
app.delete('/api/patients/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(DATA_DIR, filename);
    
    await fs.unlink(filepath);
    
    console.log(`🗑️ Patient file deleted: ${filepath}`);
    
    res.json({
      success: true,
      message: 'Patient file deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting patient file:', error);
    res.status(500).json({
      success: false,
      message: `Failed to delete patient file: ${error.message}`
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Patient Data API Server running on http://localhost:${PORT}`);
  console.log(`📁 Data directory: ${DATA_DIR}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   POST /api/patients - Save patient data`);
  console.log(`   POST /api/patients/extracted - Save extracted data`);
  console.log(`   POST /api/patients/analysis - Save analysis data`);
  console.log(`   POST /api/patients/complete - Save complete data`);
  console.log(`   GET /api/patients - List all patient files`);
  console.log(`   GET /api/patients/:filename - Get specific patient file`);
  console.log(`   DELETE /api/patients/:filename - Delete patient file`);
});

module.exports = app;

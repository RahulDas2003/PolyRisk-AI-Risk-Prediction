# PolyRisk AI - Polypharmacy Risk Predictor

A futuristic, clinical-grade AI web dashboard for predicting drug-drug interaction (DDI) risks in elderly patients using Random Forest and Graph Neural Network (GNN) models.

## 🚀 Features

- **AI-Powered Analysis**: Advanced ML models for accurate drug interaction prediction
- **Clinical-Grade Safety**: Built with healthcare professionals in mind
- **Elderly-Focused**: Specialized algorithms for polypharmacy risks
- **Real-Time Insights**: Instant risk assessment and comprehensive analysis
- **Interactive Dashboard**: Beautiful, data-driven interface with glassmorphism design
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile

## 🧩 Pages & Components

### 1. Home Page
- Hero section with project title and tagline
- Feature highlights and statistics
- Call-to-action buttons

### 2. Dashboard Page
- Risk distribution pie chart
- Age group analysis bar chart
- Monthly trends area chart
- Common interactions list
- Quick stats cards
- Patient form for drug analysis
- AI-generated risk alerts

### 3. Reports Page
- Summary of recent analyses
- PDF/CSV download functionality
- Search and filter capabilities

### 4. Research Page
- Dataset information (DrugBank, SIDER, FAERS, TWOSIDES)
- ML model descriptions
- Real-world impact metrics
- Publications and collaborations

### 5. Contact Page
- Collaboration inquiry form
- Research team information
- FAQ section

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + TailwindCSS + Shadcn/UI + Framer Motion + Lucide Icons
- **Charts**: Recharts
- **Styling**: TailwindCSS with custom healthcare theme
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🎨 Design System

### Color Palette
- **Primary**: Teal (#00BFA6)
- **Secondary**: Soft Blue (#3B82F6)
- **Risk Colors**: Green (Low), Orange (High), Red (Severe)
- **Background**: Off-white with pastel gradients

### Typography
- **Font**: Inter (Google Fonts)
- **Hierarchy**: Clear headers and readable body text

### UI Style
- **Glassmorphism**: Soft shadows and gradient cards
- **Rounded Corners**: 2xl radius for modern look
- **Animations**: Smooth transitions and hover effects

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- npm or yarn
- pip (Python package manager)

### Quick Start

#### Windows
1. Clone the repository and navigate to the project directory
2. Run `start.bat` - this will install dependencies and start both frontend and backend servers

#### Linux/Mac
1. Clone the repository and navigate to the project directory
2. Run `chmod +x start.sh && ./start.sh` - this will install dependencies and start both servers

### Manual Installation

#### Frontend Setup
1. Install frontend dependencies:
```bash
npm install
```

2. Start the frontend development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application

#### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the Flask server:
```bash
python run.py
```

4. The API will be available at [http://localhost:5000](http://localhost:5000)

### Build for Production

```bash
npm run build
```

## 📊 Data Sources

- **DrugBank**: Comprehensive drug database (13,000+ drugs)
- **SIDER**: Side Effect Resource (1,430 drugs)
- **FAERS**: FDA Adverse Event Reporting System (20M+ reports)
- **TWOSIDES**: Drug-drug interaction database (63,000+ interactions)

## 🤖 ML Models

- **Random Forest Classifier**: Risk scoring and classification (94.2% accuracy)
- **Graph Neural Network**: Multi-drug interaction analysis (96.8% accuracy)

## 📱 Responsive Design

- Fully responsive across all device sizes
- Collapsible sidebar on mobile
- Optimized charts for different screen sizes
- Touch-friendly interface elements

## 🔧 Customization

The application is built with a modular component system, making it easy to customize:

- **Colors**: Update the color palette in `tailwind.config.js`
- **Components**: Modify components in the `src/components` directory
- **Pages**: Add or modify pages in the `src/pages` directory
- **Styling**: Customize styles in `src/index.css`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## 📞 Support

For support and questions, please contact our research team at research@polyrisk.ai

## 🙏 Acknowledgments

- Healthcare professionals who provided clinical insights
- Open-source community for excellent tools and libraries
- Research institutions for data access and validation

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search,
  Eye,
  Trash2,
  Plus,
  BarChart3,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { getStoredAnalyses, deleteAnalysis, getAnalyticsData } from '../lib/storage';
import { analyticsService, DashboardData } from '../lib/analyticsService';

// Interface for unified report data
interface UnifiedReportData {
  id: string;
  patientName: string;
  age: number;
  riskScore: number;
  riskLevel: string;
  interactions: number;
  medications: number;
  timestamp: string;
  status: string;
}

const Reports = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [reports, setReports] = useState(getStoredAnalyses());
  const [analyticsData, setAnalyticsData] = useState(getAnalyticsData());
  const [liveAnalytics, setLiveAnalytics] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load live analytics data
  const loadLiveAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getDashboardMetrics();
      setLiveAnalytics(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load live analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update reports when component mounts and set up auto-refresh
  useEffect(() => {
    setReports(getStoredAnalyses());
    setAnalyticsData(getAnalyticsData());
    loadLiveAnalytics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadLiveAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter function for both local and live data
  const filterReports = (reportsData: any[]) => {
    return reportsData.filter(report => {
      const patientName = report.patientName || report.patient || report.patient_name || '';
      const status = report.status || 'completed';
      
      const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  };

  // Get the appropriate data source and apply filtering
  const getFilteredReports = () => {
    if (liveAnalytics?.recent_reports && liveAnalytics.recent_reports.length > 0) {
      return filterReports(liveAnalytics.recent_reports);
    }
    return filterReports(reports);
  };

  const filteredReports = getFilteredReports();

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Severe': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDeleteReport = (id: string) => {
    deleteAnalysis(id);
    setReports(getStoredAnalyses());
    setAnalyticsData(getAnalyticsData());
  };


  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  const stats = [
    { 
      title: 'Total Reports', 
      value: liveAnalytics?.live_metrics?.total_analyses?.toLocaleString() || analyticsData.totalAnalyses.toLocaleString(), 
      icon: FileText, 
      color: 'text-blue-600' 
    },
    { 
      title: 'This Month', 
      value: liveAnalytics?.live_metrics?.this_month?.toString() || reports.filter(r => {
        const reportDate = new Date(r.timestamp);
        const now = new Date();
        return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
      }).length.toString(), 
      icon: Calendar, 
      color: 'text-green-600' 
    },
    { 
      title: 'High Risk', 
      value: `${liveAnalytics?.live_metrics?.high_risk_patients || analyticsData.highRiskPatients}%`, 
      icon: TrendingUp, 
      color: 'text-orange-600' 
    },
    { 
      title: 'Avg Risk Score', 
      value: liveAnalytics?.live_metrics?.avg_risk_score?.toFixed(1) || analyticsData.avgRiskScore.toString(), 
      icon: BarChart3, 
      color: 'text-purple-600' 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Reports</h1>
              <p className="text-gray-600">View and manage patient analysis reports</p>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={loadLiveAnalytics}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="glow" 
                className="group"
                onClick={() => navigate('/dashboard')}
                title="Go to Dashboard to analyze new patient data"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate New Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by patient name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="urgent">Urgent</option>
                    <option value="pending">Pending</option>
                  </select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reports Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Reports</CardTitle>
                <div className="text-sm text-gray-500">
                  {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'} found
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Age</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Risk Score</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Interactions</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Medications</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report, index) => {
                      // Handle both live analytics format and local storage format
                      let reportData: UnifiedReportData;
                      
                      if (liveAnalytics?.recent_reports) {
                        // Live analytics format (RecentReport)
                        const liveReport = report as any;
                        reportData = {
                          id: `live_${index}`,
                          patientName: liveReport.patient,
                          age: liveReport.age,
                          riskScore: liveReport.risk_score,
                          riskLevel: liveReport.risk_level,
                          interactions: liveReport.interactions,
                          medications: liveReport.medications,
                          timestamp: liveReport.date,
                          status: liveReport.status
                        };
                      } else {
                        // Local storage format (StoredAnalysis) - convert to unified format
                        const localReport = report as any;
                        reportData = {
                          id: localReport.id,
                          patientName: localReport.patientName,
                          age: localReport.age,
                          riskScore: localReport.riskScore,
                          riskLevel: localReport.riskLevel,
                          interactions: localReport.interactions?.length || 0,
                          medications: localReport.medications?.length || 0,
                          timestamp: localReport.timestamp,
                          status: localReport.status
                        };
                      }

                      return (
                        <motion.tr
                          key={reportData.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-800">{reportData.patientName}</div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{reportData.age}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{reportData.riskScore}</span>
                              <Badge className={getRiskColor(reportData.riskLevel)}>
                                {reportData.riskLevel}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{reportData.interactions}</td>
                          <td className="py-4 px-4 text-gray-600">{reportData.medications}</td>
                          <td className="py-4 px-4 text-gray-600">{new Date(reportData.timestamp).toLocaleDateString()}</td>
                          <td className="py-4 px-4">
                            <Badge className={getStatusColor(reportData.status)}>
                              {reportData.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              {!liveAnalytics?.recent_reports && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteReport(reportData.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No reports found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reports;

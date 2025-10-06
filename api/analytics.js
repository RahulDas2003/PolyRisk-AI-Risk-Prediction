module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simulate analytics data
    const analyticsData = {
      model_accuracy: {
        model_accuracy: 92.5,
        risk_level_accuracy: 89.3,
        drug_interaction_accuracy: 94.1,
        side_effect_accuracy: 87.8
      },
      live_metrics: {
        total_analyses: Math.floor(Math.random() * 1000) + 500,
        high_risk_patients: Math.floor(Math.random() * 100) + 50,
        this_month: Math.floor(Math.random() * 200) + 100,
        avg_risk_score: (Math.random() * 3 + 4).toFixed(1)
      },
      charts: {
        risk_distribution: [
          { name: "Low Risk", value: 45, color: "#10B981" },
          { name: "Moderate Risk", value: 35, color: "#F59E0B" },
          { name: "High Risk", value: 20, color: "#EF4444" }
        ],
        age_groups: [
          { age_group: "60-70", count: 120, risk_score: 3.2 },
          { age_group: "70-80", count: 95, risk_score: 5.8 },
          { age_group: "80+", count: 65, risk_score: 7.4 }
        ],
        monthly_trends: [
          { month: "Jan", analyses: 45, high_risk: 8 },
          { month: "Feb", analyses: 52, high_risk: 12 },
          { month: "Mar", analyses: 48, high_risk: 9 },
          { month: "Apr", analyses: 61, high_risk: 15 },
          { month: "May", analyses: 58, high_risk: 13 },
          { month: "Jun", analyses: 67, high_risk: 18 }
        ]
      },
      recent_reports: [
        {
          id: "1",
          patient_name: "John Doe",
          age: 72,
          risk_score: 6.8,
          risk_level: "High",
          interactions: 3,
          medications: 5,
          date: "2024-01-15",
          status: "Completed"
        },
        {
          id: "2", 
          patient_name: "Jane Smith",
          age: 68,
          risk_score: 4.2,
          risk_level: "Moderate",
          interactions: 1,
          medications: 3,
          date: "2024-01-14",
          status: "Completed"
        }
      ]
    };

    return res.status(200).json(analyticsData);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({
      error: 'Failed to fetch analytics data'
    });
  }
};

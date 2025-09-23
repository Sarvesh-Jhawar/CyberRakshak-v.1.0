// API configuration and utility functions
const API_ROOT = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000"
const API_BASE = `${API_ROOT}/api`
const API_V1_BASE = `${API_BASE}/v1`

export const api = {
  // Auth endpoints
  auth: {
    login: `${API_V1_BASE}/auth/login`,
    register: `${API_V1_BASE}/auth/register`,
    logout: `${API_V1_BASE}/auth/logout`,
    me: `${API_V1_BASE}/auth/me`,
    refresh: `${API_V1_BASE}/auth/refresh`,
  },
  
  // Incidents endpoints
  incidents: {
    list: `${API_V1_BASE}/incidents`,
    create: `${API_V1_BASE}/incidents`,
    get: (id: string) => `${API_V1_BASE}/incidents/${id}`,
    update: (id: string) => `${API_V1_BASE}/incidents/${id}`,
    delete: (id: string) => `${API_V1_BASE}/incidents/${id}`,
    stats: `${API_V1_BASE}/incidents/stats/summary`,
  },
  
  // Admin endpoints
  admin: {
    summary: `${API_V1_BASE}/admin/summary`,
    actions: `${API_V1_BASE}/admin/actions`,
    users: `${API_V1_BASE}/admin/users`,
    updateUserStatus: (id: string) => `${API_V1_BASE}/admin/users/${id}/status`,
    exportIncidents: `${API_V1_BASE}/admin/incidents/export`,
    createBackup: `${API_V1_BASE}/admin/system/backup`,
    dashboardStats: `${API_V1_BASE}/admin/dashboard/stats`,
    dashboardAlerts: `${API_V1_BASE}/admin/dashboard/alerts`,
    incidentsTrends: `${API_V1_BASE}/admin/incidents/trends`,
    incidentsRisk: `${API_V1_BASE}/admin/incidents/risk`,
    incidentsPriority: `${API_V1_BASE}/admin/incidents/priority`,
    incidentsHeatmap: `${API_V1_BASE}/admin/incidents/heatmap`,
    profile: `${API_V1_BASE}/admin/profile`,
    bulkNotification: `${API_V1_BASE}/admin/notifications/bulk`,
    updateProfile: `${API_V1_BASE}/admin/profile`, // Added for PUT
    changePassword: `${API_V1_BASE}/admin/profile/change-password`,
    systemAction: `${API_BASE}/system/action`,
  },
  
  // Notifications endpoints
  notifications: {
    list: `${API_BASE}/notifications`,
    markRead: (id: string) => `${API_BASE}/notifications/${id}/read`,
    delete: (id: string) => `${API_BASE}/notifications/${id}`,
    markAllRead: `${API_BASE}/notifications/read-all`,
    count: `${API_BASE}/notifications/count`,
  },
  
  // Reports/Analytics endpoints
  reports: {
    monthlyAnalytics: `${API_BASE}/analytics/monthly`,
    threatTypes: `${API_BASE}/analytics/threat-types`,
    departmentRisk: `${API_BASE}/analytics/department-risk`,
    responseTimes: `${API_BASE}/analytics/response-times`,
    systemStatus: `${API_BASE}/system/status`,
    dashboardStatus: `${API_BASE}/dashboard/status`,
    userProfile: `${API_BASE}/user/profile`,
    userLogout: `${API_BASE}/user/logout`,
  }
}

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Helper function for API calls
export const apiCall = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

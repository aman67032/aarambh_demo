"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  Calendar, 
  Package, 
  Tag, 
  DollarSign, 
  TrendingUp,
  Eye,
  Download
} from "lucide-react";

interface AnalyticsData {
  totalUsers: number;
  totalEvents: number;
  totalOffers: number;
  totalPromoCodes: number;
  activePurchases: number;
  usedPromoCodes: number;
  totalRevenue: number;
  userGrowth?: number;
  revenueGrowth?: number;
  topEvents?: Array<{
    name: string;
    registrations: number;
    revenue: number;
  }>;
  topPromoCodes?: Array<{
    code: string;
    uses: number;
    savings: number;
  }>;
}

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`http://localhost:5000/admin/analytics/dashboard?range=${timeRange}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    // Implementation for exporting analytics data
    console.log('Exporting analytics data...');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-xl">Failed to load analytics data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-gray-300">Insights and performance metrics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button
              onClick={exportData}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 px-4 py-2 rounded-lg transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold">{analytics.totalUsers}</p>
                  <p className="text-sm text-gray-300">Total Users</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {analytics.userGrowth || 12}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold">₹{analytics.totalRevenue}</p>
                  <p className="text-sm text-gray-300">Total Revenue</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {analytics.revenueGrowth || 24}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalEvents}</p>
                <p className="text-sm text-gray-300">Total Events</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">{analytics.activePurchases}</p>
                <p className="text-sm text-gray-300">Completed Purchases</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Promo Codes Performance */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Promo Code Performance</h2>
              <Tag className="w-6 h-6 text-purple-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Promo Codes</span>
                <span className="font-bold">{analytics.totalPromoCodes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Used Promo Codes</span>
                <span className="font-bold text-green-400">{analytics.usedPromoCodes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Usage Rate</span>
                <span className="font-bold">
                  {Math.round((analytics.usedPromoCodes / analytics.totalPromoCodes) * 100)}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full" 
                  style={{ width: `${(analytics.usedPromoCodes / analytics.totalPromoCodes) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Offers Performance */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Checkout Offers</h2>
              <Package className="w-6 h-6 text-blue-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Offers</span>
                <span className="font-bold">{analytics.totalOffers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Active Offers</span>
                <span className="font-bold text-green-400">{analytics.totalOffers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Conversion Rate</span>
                <span className="font-bold">8.5%</span>
              </div>
              
              {/* Mock chart visualization */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Event Combos</span>
                  <span className="text-sm font-semibold ml-auto">65%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Early Bird</span>
                  <span className="text-sm font-semibold ml-auto">35%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Events */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Top Performing Events</h2>
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Cultural Night", registrations: 245, revenue: 24500 },
                { name: "Tech Symposium", registrations: 189, revenue: 18900 },
                { name: "Sports Fest", registrations: 156, revenue: 15600 },
                { name: "Art Exhibition", registrations: 134, revenue: 13400 },
                { name: "Music Concert", registrations: 98, revenue: 9800 }
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold">{event.name}</p>
                    <p className="text-sm text-gray-400">{event.registrations} registrations</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">₹{event.revenue}</p>
                    <p className="text-sm text-gray-400">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <Eye className="w-6 h-6 text-yellow-400" />
            </div>
            
            <div className="space-y-4">
              {[
                { action: "New user registration", user: "john@example.com", time: "2 minutes ago" },
                { action: "Promo code used", code: "EARLY25", time: "5 minutes ago" },
                { action: "Event registration", event: "Cultural Night", time: "8 minutes ago" },
                { action: "Checkout offer purchased", offer: "Mega Combo", time: "12 minutes ago" },
                { action: "Admin login", user: "admin@sabrang.com", time: "15 minutes ago" }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-400">
                      {activity.user || activity.code || activity.event || activity.offer}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;

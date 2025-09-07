"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Edit3, 
  QrCode, 
  Users, 
  Tag, 
  Package, 
  BarChart3, 
  Settings,
  Calendar,
  Gift
} from "lucide-react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import createApiUrl from "../../lib/api";

interface AnalyticsData {
  totalUsers: number;
  totalEvents: number;
  totalOffers: number;
  totalPromoCodes: number;
  activePurchases: number;
  usedPromoCodes: number;
  totalRevenue: number;
}

function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(createApiUrl('/admin/analytics/dashboard'), {
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

  const adminActions = [
    {
      title: "Add Event",
      href: "/admin/add-event",
      icon: <Plus className="w-6 h-6" />,
      gradient: "from-blue-500 to-purple-600",
      hoverGradient: "from-blue-600 to-purple-700"
    },
    {
      title: "Edit Events",
      href: "/admin/edit-event",
      icon: <Edit3 className="w-6 h-6" />,
      gradient: "from-green-400 to-cyan-400",
      hoverGradient: "from-green-500 to-cyan-500"
    },
    {
      title: "Scan QR",
      href: "/admin/scan-qr",
      icon: <QrCode className="w-6 h-6" />,
      gradient: "from-yellow-400 to-orange-500",
      hoverGradient: "from-yellow-500 to-orange-600"
    },
    {
      title: "View Users",
      href: "/admin/users",
      icon: <Users className="w-6 h-6" />,
      gradient: "from-purple-500 to-pink-600",
      hoverGradient: "from-purple-600 to-pink-700"
    },
    {
      title: "Promo Codes",
      href: "/admin/promo-codes",
      icon: <Tag className="w-6 h-6" />,
      gradient: "from-red-500 to-rose-600",
      hoverGradient: "from-red-600 to-rose-700"
    },
    {
      title: "Checkout Offers",
      href: "/admin/checkout-offers",
      icon: <Package className="w-6 h-6" />,
      gradient: "from-indigo-500 to-blue-600",
      hoverGradient: "from-indigo-600 to-blue-700"
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      gradient: "from-emerald-500 to-teal-600",
      hoverGradient: "from-emerald-600 to-teal-700"
    },
    {
      title: "Bulk Promo",
      href: "/admin/bulk-promo",
      icon: <Gift className="w-6 h-6" />,
      gradient: "from-pink-500 to-violet-600",
      hoverGradient: "from-pink-600 to-violet-700"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 text-white font-sans bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-fuchsia-400 to-rose-400 text-transparent bg-clip-text">
            Admin Dashboard
          </h1>
          <p className="text-gray-300 text-lg">Manage Sabrang 2025 Events & Users</p>
        </div>

        {/* Analytics Cards */}
        {!loading && analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="text-2xl font-bold">{analytics.totalUsers}</p>
              <p className="text-sm text-gray-300">Total Users</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-2xl font-bold">{analytics.totalEvents}</p>
              <p className="text-sm text-gray-300">Events</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <p className="text-2xl font-bold">{analytics.totalOffers}</p>
              <p className="text-sm text-gray-300">Active Offers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
              <Tag className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <p className="text-2xl font-bold">{analytics.totalPromoCodes}</p>
              <p className="text-sm text-gray-300">Promo Codes</p>
            </div>
          </div>
        )}

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adminActions.map((action, index) => (
            <Link href={action.href} key={index} className="group">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center transition-all duration-300 transform hover:scale-105 hover:bg-white/15 group-hover:shadow-2xl">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${action.gradient} mb-4 transition-all duration-300 group-hover:shadow-lg`}>
                  {action.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                  {action.title}
                </h3>
                <div className={`h-1 w-0 bg-gradient-to-r ${action.gradient} rounded-full transition-all duration-300 group-hover:w-full mx-auto`}></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        {!loading && analytics && (
          <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Quick Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">₹{analytics.totalRevenue}</div>
                <div className="text-gray-300">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{analytics.activePurchases}</div>
                <div className="text-gray-300">Completed Purchases</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{analytics.usedPromoCodes}</div>
                <div className="text-gray-300">Used Promo Codes</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap with admin protection
export default function ProtectedAdminDashboard() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
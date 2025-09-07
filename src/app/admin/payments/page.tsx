'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Eye, RefreshCw } from 'lucide-react';

interface Payment {
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  createdAt: string;
  events: string[];
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - Replace with actual API call
  const mockPayments: Payment[] = [
    {
      orderId: 'sabrang_1234567890_abc123',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      amount: 180,
      status: 'SUCCESS',
      createdAt: '2024-12-25T10:30:00Z',
      events: ['RAMPWALK - PANACHE', 'BANDJAM']
    },
    {
      orderId: 'sabrang_1234567891_def456',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      amount: 60,
      status: 'PENDING',
      createdAt: '2024-12-25T11:15:00Z',
      events: ['BANDJAM']
    },
    {
      orderId: 'sabrang_1234567892_ghi789',
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      amount: 200,
      status: 'FAILED',
      createdAt: '2024-12-25T12:00:00Z',
      events: ['Complete Experience Combo']
    }
  ];

  useEffect(() => {
    // Load payments data
    setPayments(mockPayments);
    setFilteredPayments(mockPayments);
  }, []);

  useEffect(() => {
    // Filter payments based on search and status
    let filtered = payments.filter(payment => {
      const matchesSearch = 
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredPayments(filtered);
  }, [searchTerm, statusFilter, payments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-400 bg-green-500/10';
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'FAILED':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Order ID', 'Customer Name', 'Email', 'Amount', 'Status', 'Date', 'Events'],
      ...filteredPayments.map(payment => [
        payment.orderId,
        payment.customerName,
        payment.customerEmail,
        payment.amount,
        payment.status,
        new Date(payment.createdAt).toLocaleDateString(),
        payment.events.join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sabrang_payments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-lg p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by order ID, name, or email..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-white/60" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              >
                <option value="ALL">All Status</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total Payments', value: payments.length, color: 'text-blue-400' },
            { label: 'Successful', value: payments.filter(p => p.status === 'SUCCESS').length, color: 'text-green-400' },
            { label: 'Pending', value: payments.filter(p => p.status === 'PENDING').length, color: 'text-yellow-400' },
            { label: 'Failed', value: payments.filter(p => p.status === 'FAILED').length, color: 'text-red-400' }
          ].map((stat, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-1">{stat.label}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </motion.div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-lg overflow-hidden border border-white/10"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left p-4 font-medium text-white/80">Order ID</th>
                  <th className="text-left p-4 font-medium text-white/80">Customer</th>
                  <th className="text-left p-4 font-medium text-white/80">Amount</th>
                  <th className="text-left p-4 font-medium text-white/80">Status</th>
                  <th className="text-left p-4 font-medium text-white/80">Date</th>
                  <th className="text-left p-4 font-medium text-white/80">Events</th>
                  <th className="text-left p-4 font-medium text-white/80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.orderId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-mono text-sm text-purple-300">
                        {payment.orderId}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{payment.customerName}</div>
                        <div className="text-sm text-white/60">{payment.customerEmail}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-green-400">₹{payment.amount}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-white/60">
                        {new Date(payment.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-white/80">
                        {payment.events.join(', ')}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {/* Add view details functionality */}}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-12 text-white/50">
              No payments found matching your criteria.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit3, Trash2, Copy, Tag, Calendar, Users, CheckCircle, XCircle } from "lucide-react";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import createApiUrl from "../../../lib/api";

interface PromoCode {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  description: string;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
}

interface Event {
  _id: string;
  name: string;
  category: string;
}

interface CreatePromoFormData {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  validUntil: string;
  usageLimit: number;
  allowedEmailDomains: string[];
  applicableEvents: string[];
  description: string;
}

function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState<CreatePromoFormData>({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    maxDiscountAmount: undefined,
    minOrderAmount: 0,
    validUntil: '',
    usageLimit: 1,
    allowedEmailDomains: [],
    applicableEvents: [],
    description: ''
  });

  useEffect(() => {
    fetchPromoCodes();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(createApiUrl('/admin/events-public'), {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchPromoCodes = async () => {
    try {
      const response = await fetch(createApiUrl('/admin/promo-codes'), {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data);
      }
    } catch (error) {
      console.error('Failed to fetch promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePromoCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    
    try {
      const response = await fetch(createApiUrl(`/admin/promo-codes/${id}`), {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setPromoCodes(promoCodes.filter(code => code._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete promo code:', error);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  const createPromoCode = async () => {
    try {
      const response = await fetch(createApiUrl('/admin/promo-codes'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setPromoCodes([result.promoCode, ...promoCodes]);
        setShowCreateForm(false);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create promo code');
      }
    } catch (error) {
      console.error('Failed to create promo code:', error);
      alert('Failed to create promo code');
    }
  };

  const updatePromoCode = async () => {
    if (!editingCode) return;

    try {
      const response = await fetch(createApiUrl(`/admin/promo-codes/${editingCode._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setPromoCodes(promoCodes.map(code => 
          code._id === editingCode._id ? result.promoCode : code
        ));
        setEditingCode(null);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update promo code');
      }
    } catch (error) {
      console.error('Failed to update promo code:', error);
      alert('Failed to update promo code');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      maxDiscountAmount: undefined,
      minOrderAmount: 0,
      validUntil: '',
      usageLimit: 1,
      allowedEmailDomains: [],
      applicableEvents: [],
      description: ''
    });
  };

  const handleEditClick = (code: PromoCode) => {
    setFormData({
      code: code.code,
      discountType: code.discountType,
      discountValue: code.discountValue,
      maxDiscountAmount: code.maxDiscountAmount,
      minOrderAmount: code.minOrderAmount,
      validUntil: code.validUntil.split('T')[0], // Format for date input
      usageLimit: code.usageLimit,
      allowedEmailDomains: [],
      applicableEvents: [],
      description: code.description
    });
    setEditingCode(code);
  };

  const validatePromoCode = async (code: string, orderAmount: number = 100) => {
    try {
      const response = await fetch(createApiUrl('/admin/promo-codes/validate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          code,
          userEmail: 'test@example.com',
          orderAmount
        })
      });

      const result = await response.json();
      alert(result.success 
        ? `✅ Valid! Discount: ₹${result.discountAmount}, Final: ₹${result.finalAmount}`
        : `❌ ${result.message}`
      );
    } catch (error) {
      console.error('Failed to validate promo code:', error);
      alert('Failed to validate promo code');
    }
  };

  const formatDiscount = (code: PromoCode) => {
    if (code.discountType === 'percentage') {
      return `${code.discountValue}%${code.maxDiscountAmount ? ` (max ₹${code.maxDiscountAmount})` : ''}`;
    }
    return `₹${code.discountValue}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-xl">Loading promo codes...</div>
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
              <h1 className="text-3xl font-bold">Promo Codes Management</h1>
              <p className="text-gray-300">Create and manage discount codes</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Create Promo Code</span>
            </button>
            
            <Link href="/admin/bulk-promo" className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
              <Tag className="w-5 h-5" />
              <span>Bulk Create</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Tag className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{promoCodes.length}</p>
                <p className="text-sm text-gray-300">Total Codes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold">{promoCodes.filter(code => code.isActive).length}</p>
                <p className="text-sm text-gray-300">Active Codes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold">{promoCodes.reduce((sum, code) => sum + code.usedCount, 0)}</p>
                <p className="text-sm text-gray-300">Total Uses</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">
                  {promoCodes.filter(code => new Date(code.validUntil) > new Date()).length}
                </p>
                <p className="text-sm text-gray-300">Valid Codes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Codes Table */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Discount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Usage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Valid Until</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {promoCodes.map((code) => (
                  <tr key={code._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-lg">{code.code}</span>
                        <button
                          onClick={() => copyToClipboard(code.code)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="Copy code"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-400">{code.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">{formatDiscount(code)}</span>
                      {code.minOrderAmount > 0 && (
                        <p className="text-sm text-gray-400">Min: ₹{code.minOrderAmount}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="font-semibold">{code.usedCount}</span>
                        <span className="text-gray-400"> / {code.usageLimit}</span>
                      </div>
                      <div className="w-20 bg-gray-700 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(code.usedCount / code.usageLimit) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">
                        {new Date(code.validUntil).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {code.isActive ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className={`text-sm ${code.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          {code.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => validatePromoCode(code.code)}
                          className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                          title="Test promo code"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(code)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Edit promo code"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePromoCode(code._id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                          title="Delete promo code"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {promoCodes.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Promo Codes Found</h3>
            <p className="text-gray-400 mb-6">Create your first promo code to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Create Promo Code
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingCode) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingCode ? 'Edit Promo Code' : 'Create New Promo Code'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingCode(null);
                  resetForm();
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              editingCode ? updatePromoCode() : createPromoCode();
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Promo Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SAVE20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Discount Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.maxDiscountAmount || ''}
                      onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value ? Number(e.target.value) : undefined})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      placeholder="Optional"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Order Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Valid Until</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Description of the promo code..."
                />
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  {editingCode ? 'Update Promo Code' : 'Create Promo Code'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingCode(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProtectedPromoCodesPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <PromoCodesPage />
    </ProtectedRoute>
  );
}

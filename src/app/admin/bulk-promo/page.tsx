"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Gift, Download, Copy, Plus } from "lucide-react";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import createApiUrl from "../../../lib/api";

interface BulkPromoForm {
  codePrefix: string;
  count: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  validUntil: string;
  allowedEmailDomains: string[];
  description: string;
}

function BulkPromoPage() {
  const [formData, setFormData] = useState<BulkPromoForm>({
    codePrefix: 'SABRANG25_',
    count: 50,
    discountType: 'percentage',
    discountValue: 10,
    maxDiscountAmount: undefined,
    minOrderAmount: 0,
    validUntil: '',
    allowedEmailDomains: [],
    description: ''
  });

  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailDomain, setEmailDomain] = useState('');

  const addEmailDomain = () => {
    if (emailDomain && !formData.allowedEmailDomains.includes(emailDomain)) {
      setFormData(prev => ({
        ...prev,
        allowedEmailDomains: [...prev.allowedEmailDomains, emailDomain]
      }));
      setEmailDomain('');
    }
  };

  const removeEmailDomain = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      allowedEmailDomains: prev.allowedEmailDomains.filter(d => d !== domain)
    }));
  };

  const generateCodes = async () => {
    setLoading(true);
    try {
      const response = await fetch(createApiUrl('/admin/promo-codes/bulk'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setGeneratedCodes(result.codes);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to generate promo codes:', error);
      alert('Failed to generate promo codes');
    } finally {
      setLoading(false);
    }
  };

  const downloadCodes = () => {
    const csvContent = [
      'Promo Code,Discount Type,Discount Value,Min Order Amount,Valid Until,Description',
      ...generatedCodes.map(code => 
        `${code},${formData.discountType},${formData.discountValue},${formData.minOrderAmount},${formData.validUntil},${formData.description}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promo_codes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyAllCodes = () => {
    navigator.clipboard.writeText(generatedCodes.join('\n'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/admin/promo-codes" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Bulk Promo Code Generator</h1>
            <p className="text-gray-300">Generate multiple promo codes at once</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Configure Promo Codes</h2>
            
            <div className="space-y-6">
              {/* Code Prefix */}
              <div>
                <label className="block text-sm font-medium mb-2">Code Prefix</label>
                <input
                  type="text"
                  value={formData.codePrefix}
                  onChange={(e) => setFormData(prev => ({ ...prev, codePrefix: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                  placeholder="e.g., SABRANG25_"
                />
                <p className="text-xs text-gray-400 mt-1">Codes will be generated as PREFIX0001, PREFIX0002, etc.</p>
              </div>

              {/* Count */}
              <div>
                <label className="block text-sm font-medium mb-2">Number of Codes</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.count}
                  onChange={(e) => setFormData(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Discount Type</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'fixed' }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.discountValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>

              {/* Max Discount Amount (for percentage) */}
              {formData.discountType === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Max Discount Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxDiscountAmount || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                    placeholder="Optional"
                  />
                </div>
              )}

              {/* Min Order Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: parseFloat(e.target.value) }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>

              {/* Valid Until */}
              <div>
                <label className="block text-sm font-medium mb-2">Valid Until</label>
                <input
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>

              {/* Email Domains */}
              <div>
                <label className="block text-sm font-medium mb-2">Allowed Email Domains (Optional)</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={emailDomain}
                    onChange={(e) => setEmailDomain(e.target.value)}
                    placeholder="e.g., student.university.edu"
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                  />
                  <button
                    onClick={addEmailDomain}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {formData.allowedEmailDomains.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.allowedEmailDomains.map((domain, index) => (
                      <span 
                        key={index}
                        className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                      >
                        <span>{domain}</span>
                        <button
                          onClick={() => removeEmailDomain(domain)}
                          className="hover:text-blue-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                  rows={3}
                  placeholder="Description for the promo codes..."
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateCodes}
                disabled={loading || !formData.validUntil}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {loading ? 'Generating...' : `Generate ${formData.count} Promo Codes`}
              </button>
            </div>
          </div>

          {/* Generated Codes */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Generated Codes</h2>
              {generatedCodes.length > 0 && (
                <div className="flex space-x-2">
                  <button
                    onClick={copyAllCodes}
                    className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy All</span>
                  </button>
                  <button
                    onClick={downloadCodes}
                    className="flex items-center space-x-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV</span>
                  </button>
                </div>
              )}
            </div>

            {generatedCodes.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {generatedCodes.map((code, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <span className="font-mono text-sm">{code}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(code)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Codes Generated Yet</h3>
                <p className="text-gray-400">Fill out the form and click generate to create promo codes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedBulkPromoPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <BulkPromoPage />
    </ProtectedRoute>
  );
}

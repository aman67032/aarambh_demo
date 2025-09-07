"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Tag, Calculator } from "lucide-react";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import createApiUrl from "../../../lib/api";

interface ValidationResult {
  success: boolean;
  message: string;
  discountAmount?: number;
  finalAmount?: number;
}

function TestPromoPage() {
  const [promoCode, setPromoCode] = useState('');
  const [orderAmount, setOrderAmount] = useState(100);
  const [userEmail, setUserEmail] = useState('test@example.com');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testPromoCode = async () => {
    if (!promoCode.trim()) {
      alert('Please enter a promo code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(createApiUrl('/admin/promo-codes/validate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          code: promoCode.toUpperCase(),
          userEmail,
          orderAmount
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Failed to validate promo code:', error);
      setResult({
        success: false,
        message: 'Failed to validate promo code. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setPromoCode('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/admin/promo-codes" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Test Promo Codes</h1>
            <p className="text-gray-300">Validate promo codes and check discounts</p>
          </div>
        </div>

        {/* Test Form */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Promo Code</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter promo code (e.g., SAVE20)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Order Amount (₹)</label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">User Email (for domain restrictions)</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={testPromoCode}
                disabled={loading || !promoCode.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Validating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Test Promo Code</span>
                  </>
                )}
              </button>

              {result && (
                <button
                  onClick={resetTest}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 ${
            result.success ? 'border-green-500/50' : 'border-red-500/50'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              {result.success ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400" />
              )}
              <div>
                <h3 className={`text-xl font-bold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.success ? 'Valid Promo Code!' : 'Invalid Promo Code'}
                </h3>
                <p className="text-gray-300">{result.message}</p>
              </div>
            </div>

            {result.success && result.discountAmount !== undefined && (
              <div className="bg-white/5 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">₹{orderAmount}</div>
                    <div className="text-sm text-gray-400">Original Amount</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">-₹{result.discountAmount}</div>
                    <div className="text-sm text-gray-400">Discount</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">₹{result.finalAmount}</div>
                    <div className="text-sm text-gray-400">Final Amount</div>
                  </div>
                </div>
                
                <div className="text-center pt-2">
                  <div className="text-green-400 font-semibold">
                    You save ₹{result.discountAmount} ({((result.discountAmount / orderAmount) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">How to Test:</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Enter the promo code you want to test</li>
            <li>• Set an order amount to test minimum order requirements</li>
            <li>• Use different email domains to test domain restrictions</li>
            <li>• Check if the discount calculation is correct</li>
            <li>• Verify expiry dates and usage limits</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedTestPromoPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <TestPromoPage />
    </ProtectedRoute>
  );
}

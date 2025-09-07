"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit3, Trash2, Package, Calendar, DollarSign, CheckCircle, XCircle, Users } from "lucide-react";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import createApiUrl from "../../../lib/api";

interface CheckoutOffer {
  _id: string;
  offerName: string;
  description: string;
  events: Array<{
    eventId: {
      _id: string;
      name: string;
      category: string;
    };
    customPrice?: number;
  }>;
  comboPrice: number;
  originalTotalPrice: number;
  discountPercentage: number;
  validUntil: string;
  maxPurchases?: number;
  currentPurchases: number;
  isActive: boolean;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
}

function CheckoutOffersPage() {
  const [offers, setOffers] = useState<CheckoutOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<CheckoutOffer | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/checkout-offers', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error('Failed to fetch checkout offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this checkout offer?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/admin/checkout-offers/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setOffers(offers.filter(offer => offer._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete checkout offer:', error);
    }
  };

  const toggleOfferStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/checkout-offers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      if (response.ok) {
        setOffers(offers.map(offer => 
          offer._id === id ? { ...offer, isActive: !currentStatus } : offer
        ));
      }
    } catch (error) {
      console.error('Failed to toggle offer status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-xl">Loading checkout offers...</div>
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
              <h1 className="text-3xl font-bold">Checkout Offers Management</h1>
              <p className="text-gray-300">Create and manage event combo offers</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Create Offer</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{offers.length}</p>
                <p className="text-sm text-gray-300">Total Offers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold">{offers.filter(offer => offer.isActive).length}</p>
                <p className="text-sm text-gray-300">Active Offers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold">{offers.reduce((sum, offer) => sum + offer.currentPurchases, 0)}</p>
                <p className="text-sm text-gray-300">Total Purchases</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(offers.reduce((sum, offer) => sum + offer.discountPercentage, 0) / offers.length || 0)}%
                </p>
                <p className="text-sm text-gray-300">Avg Discount</p>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer._id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              {/* Offer Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{offer.offerName}</h3>
                  <p className="text-gray-300 text-sm">{offer.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {offer.isActive ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>

              {/* Events List */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Included Events:</h4>
                <div className="space-y-1">
                  {offer.events.map((event, index) => (
                    <div key={index} className="text-sm bg-white/5 rounded-lg p-2">
                      <span className="font-medium">{event.eventId.name}</span>
                      <span className="text-gray-400 ml-2">({event.eventId.category})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Original Price:</span>
                  <span className="line-through text-gray-400">₹{offer.originalTotalPrice}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Combo Price:</span>
                  <span className="text-green-400 font-bold text-lg">₹{offer.comboPrice}</span>
                </div>
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-2 text-center">
                  <span className="text-green-400 font-bold">{offer.discountPercentage}% OFF</span>
                  <span className="text-gray-300 ml-2">Save ₹{offer.originalTotalPrice - offer.comboPrice}</span>
                </div>
              </div>

              {/* Usage Stats */}
              {offer.maxPurchases && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-300">Purchases:</span>
                    <span>{offer.currentPurchases} / {offer.maxPurchases}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(offer.currentPurchases / offer.maxPurchases) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Validity */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Valid until:</span>
                  <span className={`font-medium ${new Date(offer.validUntil) > new Date() ? 'text-green-400' : 'text-red-400'}`}>
                    {new Date(offer.validUntil).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => setEditingOffer(offer)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                
                <button
                  onClick={() => toggleOfferStatus(offer._id, offer.isActive)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors ${
                    offer.isActive 
                      ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400' 
                      : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                  }`}
                >
                  {offer.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  <span>{offer.isActive ? 'Disable' : 'Enable'}</span>
                </button>
                
                <button
                  onClick={() => deleteOffer(offer._id)}
                  className="flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {offers.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Checkout Offers Found</h3>
            <p className="text-gray-400 mb-6">Create your first combo offer to boost sales</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Create Offer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutOffersPage;

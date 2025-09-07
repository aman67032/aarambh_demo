"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, UserCheck, UserX, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import createApiUrl from '../../../lib/api';
import ProtectedRoute from '../../../../components/ProtectedRoute';

interface User {
  _id: string;
  name: string;
  email: string;
  hasEntered: boolean;
  entryTime: string | null;
  events: string[];
  referalcount: number;
  isAdmin: boolean;
  isvalidated: boolean;
}

interface EntryResponse {
  success: boolean;
  message: string;
  playBuzzer: boolean;
  entryTime?: string;
}

function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingEntry, setProcessingEntry] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(createApiUrl('/admin/users'), {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const allowEntry = async (userId: string) => {
    setProcessingEntry(userId);
    try {
      const response = await fetch(createApiUrl(`/admin/allow-entry/${userId}`), {
        method: 'POST',
        credentials: 'include'
      });

      const result: EntryResponse = await response.json();
      
      if (result.success) {
        // Update the user in the local state
        setUsers(users.map(user => 
          user._id === userId 
            ? { ...user, hasEntered: true, entryTime: result.entryTime || new Date().toISOString() }
            : user
        ));
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ ${result.message}`);
        if (result.playBuzzer) {
          // You could play a buzzer sound here
          console.log('🚨 Buzzer sound should play');
        }
      }
    } catch (error) {
      console.error('Failed to allow entry:', error);
      alert('Failed to process entry request');
    } finally {
      setProcessingEntry(null);
    }
  };

  const resetUserEntry = async (userId: string) => {
    if (!confirm('Are you sure you want to reset this user\'s entry status?')) return;

    try {
      // This would require a new endpoint in your backend
      // For now, we'll just update the local state
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, hasEntered: false, entryTime: null }
          : user
      ));
      alert('User entry status reset successfully');
    } catch (error) {
      console.error('Failed to reset user entry:', error);
      alert('Failed to reset user entry');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enteredUsersCount = users.filter(user => user.hasEntered).length;
  const totalUsers = users.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center p-4 bg-red-500/20 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Users Management</h1>
                <p className="text-gray-300">Manage user entries and registrations</p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                  <p className="text-sm text-gray-300">Total Users</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold">{enteredUsersCount}</p>
                  <p className="text-sm text-gray-300">Entered Event</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold">{totalUsers - enteredUsersCount}</p>
                  <p className="text-sm text-gray-300">Pending Entry</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <UserX className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => !u.isvalidated).length}</p>
                  <p className="text-sm text-gray-300">Unvalidated</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Entry Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-white">{user.name}</span>
                            {user.isAdmin && (
                              <span className="px-2 py-1 text-xs bg-red-600 text-white rounded-full">
                                Admin
                              </span>
                            )}
                            {!user.isvalidated && (
                              <span className="px-2 py-1 text-xs bg-yellow-600 text-white rounded-full">
                                Unvalidated
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {user.hasEntered ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-red-400" />
                            <div>
                              <span className="text-red-400 font-semibold">Entered</span>
                              <div className="text-xs text-gray-400">
                                {user.entryTime 
                                  ? new Date(user.entryTime).toLocaleString()
                                  : 'Time unknown'
                                }
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-semibold">Can Enter</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            {user.events.length}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">Events</div>
                        </div>
                        <div className="text-center">
                          <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            {user.referalcount}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">Referrals</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {!user.hasEntered ? (
                          <button
                            onClick={() => allowEntry(user._id)}
                            disabled={processingEntry === user._id}
                            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:opacity-50 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 flex items-center space-x-2"
                          >
                            {processingEntry === user._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4" />
                                <span>Allow Entry</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => resetUserEntry(user._id)}
                            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 flex items-center space-x-2"
                          >
                            <AlertTriangle className="w-4 h-4" />
                            <span>Reset Entry</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserX className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Users Found</h3>
              <p className="text-gray-400">
                {searchTerm ? 'No users match your search criteria.' : 'No users have registered yet.'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Wrap with admin protection
export default function ProtectedUsersManagement() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <UsersManagement />
    </ProtectedRoute>
  );
}

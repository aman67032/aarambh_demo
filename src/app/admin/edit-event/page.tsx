"use client";
import React, { useEffect, useState } from "react";
import { FiEdit, FiExternalLink, FiX, FiSave } from "react-icons/fi";
import createApiUrl from "../../../lib/api";

interface Event {
  _id: string;
  name: string;
  coordinator: string;
  mobile: string;
  qrID: string;
  date: string;
  whatsappLink: string;
}

export default function EditEvent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(createApiUrl('/admin/events'), {
          credentials: 'include' // Include cookies for authentication
        });
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleEdit = (event: Event) => {
    setEditingEvent({ ...event });
  };

  const handleFieldChange = (field: keyof Event, value: string) => {
    setEditingEvent(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleSave = async () => {
    if (!editingEvent) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(createApiUrl('/admin/update'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(editingEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      // Update the local state with the edited event
      setEvents(events.map(event => 
        event._id === editingEvent._id ? editingEvent : event
      ));

      setEditingEvent(null);
    } catch (err) {
      console.error("Error updating event:", err);
      setError(err instanceof Error ? err.message : "Failed to update event");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Manage Events</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div 
              key={event._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Edit event"
                  >
                    <FiEdit size={20} />
                  </button>
                </div>

                <div className="space-y-3 text-gray-600">
                  <p><span className="font-medium">Coordinator:</span> {event.coordinator}</p>
                  <p><span className="font-medium">Mobile:</span> {event.mobile}</p>
                  <p><span className="font-medium">QR ID:</span> {event.qrID}</p>
                  <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
                  <p className="flex items-center">
                    <span className="font-medium mr-2">WhatsApp:</span>
                    <a 
                      href={event.whatsappLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Open Link <FiExternalLink className="ml-1" size={14} />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Event</h3>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  value={editingEvent.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coordinator</label>
                <input
                  type="text"
                  value={editingEvent.coordinator || ''}
                  onChange={(e) => handleFieldChange('coordinator', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  type="text"
                  value={editingEvent.mobile || ''}
                  onChange={(e) => handleFieldChange('mobile', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">QR ID</label>
                <input
                  type="text"
                  value={editingEvent.qrID || ''}
                  onChange={(e) => handleFieldChange('qrID', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editingEvent.date ? new Date(editingEvent.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Link</label>
                <input
                  type="url"
                  value={editingEvent.whatsappLink || ''}
                  onChange={(e) => handleFieldChange('whatsappLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center"
              >
                <FiX className="mr-2" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
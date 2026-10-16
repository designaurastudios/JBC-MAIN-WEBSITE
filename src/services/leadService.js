import { useState, useEffect } from 'react';
import { 
  subscribeToCollection, 
  updateDocumentSafely, 
  deleteDocumentSafely 
} from '../firebase/firestore';

/**
 * Service to manage and sync customer quote leads and contact inquiries in real time
 */
export function useLeads() {
  const [contactLeads, setContactLeads] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jbc_contactMessages') || '[]');
    } catch {
      return [];
    }
  });

  const [quoteLeads, setQuoteLeads] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jbc_quoteRequests') || '[]');
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Subscribe to Contact Form Inquiries
    const unsubContact = subscribeToCollection('contactMessages', (liveMessages) => {
      const normalized = (liveMessages || []).map(item => ({
        ...item,
        collectionName: 'contactMessages',
        leadType: 'Contact Form',
        serviceRequired: item.serviceRequired || 'General Plumbing Consultation',
        message: item.message || '',
        submittedAt: item.submittedAt || item.createdAt || new Date().toISOString()
      }));
      setContactLeads(normalized);
      setLoading(false);
    });

    // 2. Subscribe to Quote Request Leads
    const unsubQuote = subscribeToCollection('quoteRequests', (liveQuotes) => {
      const normalized = (liveQuotes || []).map(item => ({
        ...item,
        collectionName: 'quoteRequests',
        status: item.status || 'Not Contacted',
        leadType: 'Quotation Request',
        siteAddress: item.siteAddress || item.projectLocation || '',
        googleMapsLink: item.googleMapsLink || '',
        message: item.message || item.projectDescription || '',
        submittedAt: item.submittedAt || item.createdAt || new Date().toISOString()
      }));
      setQuoteLeads(normalized);
    });

    return () => {
      if (typeof unsubContact === 'function') unsubContact();
      if (typeof unsubQuote === 'function') unsubQuote();
    };
  }, []);

  // Sorted newest first
  const sortedQuoteLeads = [...quoteLeads].sort((a, b) => {
    const timeA = new Date(a.submittedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.submittedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  const sortedContactInquiries = [...contactLeads].sort((a, b) => {
    const timeA = new Date(a.submittedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.submittedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  // Update lead status in Firestore (for quote requests)
  const changeLeadStatus = async (leadId, newStatus, collectionName = 'quoteRequests') => {
    const targetCollection = collectionName || 'quoteRequests';
    await updateDocumentSafely(targetCollection, leadId, {
      status: newStatus,
      statusUpdatedAt: new Date().toISOString()
    });

    // Optimistic local state update
    if (targetCollection === 'quoteRequests') {
      setQuoteLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    } else {
      setContactLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    }
  };

  // Delete lead/inquiry from Firestore
  const removeLead = async (leadId, collectionName = 'quoteRequests') => {
    const targetCollection = collectionName || 'quoteRequests';
    await deleteDocumentSafely(targetCollection, leadId);

    if (targetCollection === 'quoteRequests') {
      setQuoteLeads(prev => prev.filter(l => l.id !== leadId));
    } else {
      setContactLeads(prev => prev.filter(l => l.id !== leadId));
    }
  };

  // Update full lead/inquiry details in Firestore (admin edit capability)
  const updateLeadDetails = async (leadId, updatedFields, collectionName = 'quoteRequests') => {
    const targetCollection = collectionName || 'quoteRequests';
    const payload = {
      ...updatedFields,
      lastModifiedAt: new Date().toISOString()
    };
    await updateDocumentSafely(targetCollection, leadId, payload);

    // Optimistic local state update
    if (targetCollection === 'quoteRequests') {
      setQuoteLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...payload } : l));
    } else {
      setContactLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...payload } : l));
    }
  };

  return {
    quoteLeads: sortedQuoteLeads,
    contactInquiries: sortedContactInquiries,
    leads: [...sortedQuoteLeads, ...sortedContactInquiries],
    loading,
    changeLeadStatus,
    updateLeadDetails,
    removeLead
  };
}

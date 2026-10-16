import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCompanyInfo } from '../../context/CompanyContext';
import { useProjects, seedAllProjectsToFirestore } from '../../services/projectService';
import { useLeads } from '../../services/leadService';
import { uploadProjectImage } from '../../firebase/storage';
import { SEO } from '../../seo/SEO';
import toast from 'react-hot-toast';
import { 
  Settings, 
  Layers, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Share2, 
  Phone, 
  MapPin, 
  Image as ImageIcon, 
  Info,
  Search,
  X,
  Sparkles,
  RefreshCw,
  UploadCloud,
  Check,
  Loader2,
  Users,
  Calendar,
  Filter,
  Mail,
  ArrowUpRight,
  TrendingUp,
  Clock3,
  UserX,
  RotateCcw,
  MessageSquare,
  Building,
  CheckCircle,
  Inbox,
  Menu,
  ChevronDown,
  Table,
  LayoutGrid,
  Eye,
  AlertTriangle,
  ShieldCheck,
  KeyRound,
  Lock,
  Copy
} from 'lucide-react';
import { FaWhatsapp, FaYoutube, FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';

export function AdminDashboard() {
  const { currentUser, logout, refreshJwt, securityInfo, timeRemainingFormatted, jwtToken } = useAuth();
  const { company, updateCompanyDetails } = useCompanyInfo();
  const { projects, createProject, editProject, removeProject } = useProjects();
  const { quoteLeads, contactInquiries, loading: leadsLoading, changeLeadStatus, updateLeadDetails, removeLead } = useLeads();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'projects' | 'quoteLeads' | 'contactInquiries'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);

  // =========================================================================
  // Tab 1: Company Settings State
  // =========================================================================
  const [formData, setFormData] = useState({
    phone: company.phone || '+91 98925 57166',
    whatsapp: company.whatsapp || '+91 99874 43006',
    email: company.email || 'jaibhavaiconstructions@gmail.com',
    weekdayHours: company.workingHours?.weekdayTime || '9:00 AM - 6:00 PM',
    sundayHours: company.workingHours?.sundayTime || '9:00 AM - 2:00 PM',
  });

  const [socialLinks, setSocialLinks] = useState(company.socialLinks || [
    { id: "yt", platform: "YouTube", key: "yt", url: "https://youtube.com/@jaibhavaniconstructions" },
    { id: "insta", platform: "Instagram", key: "insta", url: "https://instagram.com/jaibhavaniconstructions" },
    { id: "facebook", platform: "Facebook", key: "facebook", url: "https://facebook.com/jaibhavaniconstructions" }
  ]);

  const [newPlatformName, setNewPlatformName] = useState('');
  const [newPlatformUrl, setNewPlatformUrl] = useState('');
  const [isAddingSocial, setIsAddingSocial] = useState(false);

  const [saveStatus, setSaveStatus] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Global Delete / Destructive Action Confirmation Modal State
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    title: '',
    itemName: '',
    description: '',
    confirmButtonText: 'Yes, Delete Permanently',
    isDanger: true,
    isProcessing: false,
    onConfirm: null
  });

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmModal(prev => ({ ...prev, isOpen: false, isProcessing: false, onConfirm: null }));
  };

  // =========================================================================
  // Tab 2: Projects State
  // =========================================================================
  const [projectSearch, setProjectSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [projectForm, setProjectForm] = useState({
    name: '',
    image: '',
    location: '',
    description: '',
    status: 'Completed Work'
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [projectActionStatus, setProjectActionStatus] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // =========================================================================
  // Tab 3: Quote Leads Management State (Quote Form Only)
  // =========================================================================
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [quoteSearch, setQuoteSearch] = useState('');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState('All'); // 'All' | 'Not Contacted' | 'Contacted' | 'Converted' | 'Not Converted'
  const [quoteDateFilterMode, setQuoteDateFilterMode] = useState('today'); // 'today' | 'all' | 'custom'
  const [quoteCustomDate, setQuoteCustomDate] = useState(getTodayString());
  const [quoteViewMode, setQuoteViewMode] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'table' : 'card';
  });
  const [editingQuoteLead, setEditingQuoteLead] = useState(null);
  const [viewingQuoteDetail, setViewingQuoteDetail] = useState(null);
  const [isQuoteEditModalOpen, setIsQuoteEditModalOpen] = useState(false);
  const [quoteEditForm, setQuoteEditForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    serviceRequired: '',
    projectType: '',
    siteAddress: '',
    googleMapsLink: '',
    status: 'Not Contacted',
    message: ''
  });

  // =========================================================================
  // Tab 4: Contact Inquiries State (Contact Form Only)
  // =========================================================================
  const [contactSearch, setContactSearch] = useState('');
  const [contactServiceFilter, setContactServiceFilter] = useState('All');
  const [contactDateFilterMode, setContactDateFilterMode] = useState('today'); // 'today' | 'all' | 'custom'
  const [contactCustomDate, setContactCustomDate] = useState(getTodayString());
  const [contactViewMode, setContactViewMode] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'table' : 'card';
  });
  const [editingContactItem, setEditingContactItem] = useState(null);
  const [viewingContactDetail, setViewingContactDetail] = useState(null);
  const [isContactEditModalOpen, setIsContactEditModalOpen] = useState(false);
  const [contactEditForm, setContactEditForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    serviceRequired: '',
    message: ''
  });

  // Sync state when company context updates
  useEffect(() => {
    if (company) {
      setFormData({
        phone: company.phone || '+91 98925 57166',
        whatsapp: company.whatsapp || '+91 99874 43006',
        email: company.email || 'jaibhavaiconstructions@gmail.com',
        weekdayHours: company.workingHours?.weekdayTime || '9:00 AM - 6:00 PM',
        sundayHours: company.workingHours?.sundayTime || '9:00 AM - 2:00 PM',
      });
      if (company.socialLinks) {
        setSocialLinks(company.socialLinks);
      }
    }
  }, [company]);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out safely. Session token invalidated.');
    navigate('/admin/login');
  };

  const handleRotateJwtToken = async () => {
    setIsRefreshingToken(true);
    try {
      await refreshJwt();
    } finally {
      setIsRefreshingToken(false);
    }
  };

  const handleCopyJwt = () => {
    if (jwtToken) {
      navigator.clipboard.writeText(jwtToken);
      setTokenCopied(true);
      toast.success('JWT Cryptographic Token copied to clipboard!');
      setTimeout(() => setTokenCopied(false), 2500);
    }
  };

  // =========================================================================
  // Tab 1 Handlers: Basic Details Save
  // =========================================================================
  const handleSaveBasicDetails = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    try {
      await updateCompanyDetails({
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        workingHours: {
          weekday: `Monday - Saturday: ${formData.weekdayHours}`,
          weekdayShort: `Mon - Sat: ${formData.weekdayHours}`,
          weekdayTime: formData.weekdayHours,
          sunday: `Sunday: ${formData.sundayHours}`,
          sundayShort: `Sun: ${formData.sundayHours}`,
          sundayTime: formData.sundayHours,
        },
        socialLinks: socialLinks
      });

      setSaveStatus('success');
      setSaveMessage('All basic details & social channels updated successfully!');
      toast.success('Basic details & social channels updated in real time!');
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setSaveMessage('Failed to save details. Please check connection and try again.');
      toast.error('Failed to save details. Please try again.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  const handleSocialUrlChange = (id, newUrl) => {
    setSocialLinks(prev => prev.map(s => s.id === id ? { ...s, url: newUrl } : s));
  };

  const handleAddSocialPlatform = () => {
    if (!newPlatformName.trim() || !newPlatformUrl.trim()) return;

    const newKey = newPlatformName.toLowerCase().replace(/\s+/g, '');
    const newSocial = {
      id: `custom_${Date.now()}`,
      platform: newPlatformName.trim(),
      key: newKey,
      url: newPlatformUrl.trim()
    };

    setSocialLinks(prev => [...prev, newSocial]);
    setNewPlatformName('');
    setNewPlatformUrl('');
    setIsAddingSocial(false);
    toast.success(`Added ${newPlatformName} link.`);
  };

  const handleRemoveSocial = (socialOrId) => {
    const social = typeof socialOrId === 'object' 
      ? socialOrId 
      : (socialLinks.find(s => s.id === socialOrId) || { id: socialOrId, platform: 'Social Link' });

    setDeleteConfirmModal({
      isOpen: true,
      title: 'Remove Social Media Profile',
      itemName: social.platform,
      description: `Are you sure you want to remove the "${social.platform}" social link from your company contact profile?`,
      confirmButtonText: 'Yes, Remove Profile',
      isDanger: true,
      isProcessing: false,
      onConfirm: () => {
        setSocialLinks(prev => prev.filter(s => s.id !== social.id));
        toast.success(`${social.platform} link removed.`);
        closeDeleteConfirmModal();
      }
    });
  };

  // =========================================================================
  // Tab 2 Handlers: Project Image & Management
  // =========================================================================
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      const msg = 'Image size exceeds 2MB limit. Please choose a smaller photo.';
      setUploadError(msg);
      toast.error(msg);
      return;
    }

    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const cloudUrl = await uploadProjectImage(file, (p) => {
        setUploadProgress(p);
      });
      setProjectForm(prev => ({ ...prev, image: cloudUrl }));
      setUploadError('');
      toast.success('Image optimized & attached successfully!');
    } catch (err) {
      console.error('Image upload failed:', err);
      const errMsg = err.message || 'Failed to process image.';
      setUploadError(errMsg);
      toast.error(errMsg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenAddProject = () => {
    setEditingProjectId(null);
    setUploadError('');
    setUploadingImage(false);
    setUploadProgress(0);
    setProjectForm({
      name: '',
      image: '',
      location: '',
      description: '',
      status: 'Completed Work'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setUploadError('');
    setUploadingImage(false);
    setUploadProgress(0);
    setProjectForm({
      name: proj.name || '',
      image: proj.image || '',
      location: proj.location || '',
      description: proj.description || '',
      status: proj.status || 'Completed Work'
    });
    setIsModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.name.trim()) {
      toast.error('Please enter the project name.');
      return;
    }

    try {
      if (editingProjectId) {
        await editProject(editingProjectId, projectForm);
        const msg = 'Project updated successfully in real time!';
        setProjectActionStatus(msg);
        toast.success(msg);
      } else {
        await createProject(projectForm);
        const msg = 'New project added successfully!';
        setProjectActionStatus(msg);
        toast.success(msg);
      }
      setIsModalOpen(false);
      setTimeout(() => setProjectActionStatus(null), 3500);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save project. Please try again.');
    }
  };

  const handleSeedProjects = () => {
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Upload Default Mumbai Projects',
      itemName: '55 Mumbai Projects',
      description: 'Upload all 55 default Mumbai completed & ongoing construction projects directly into your live Firebase Firestore database?',
      confirmButtonText: 'Yes, Upload 55 Projects',
      isDanger: false,
      isProcessing: false,
      onConfirm: async () => {
        setIsSeeding(true);
        setDeleteConfirmModal(prev => ({ ...prev, isProcessing: true }));
        try {
          const res = await seedAllProjectsToFirestore();
          const msg = `🎉 Success! All ${res.count} projects uploaded to Firebase Firestore!`;
          setProjectActionStatus(msg);
          toast.success(msg);
          setTimeout(() => setProjectActionStatus(null), 6000);
          closeDeleteConfirmModal();
        } catch (err) {
          console.error(err);
          toast.error('Failed to seed projects to Firebase. Ensure Firestore is created in Firebase Console.');
          setDeleteConfirmModal(prev => ({ ...prev, isProcessing: false }));
        } finally {
          setIsSeeding(false);
        }
      }
    });
  };

  const handleDeleteProject = (id, name) => {
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Delete Project Portfolio Item',
      itemName: name,
      description: `Are you sure you want to permanently delete "${name}"? This project will be immediately removed from both the Admin Panel and the public portfolio.`,
      confirmButtonText: 'Yes, Delete Project',
      isDanger: true,
      isProcessing: false,
      onConfirm: async () => {
        setDeleteConfirmModal(prev => ({ ...prev, isProcessing: true }));
        try {
          await removeProject(id);
          const msg = `"${name}" deleted successfully.`;
          setProjectActionStatus(msg);
          toast.success(msg);
          setTimeout(() => setProjectActionStatus(null), 3500);
          closeDeleteConfirmModal();
        } catch (err) {
          console.error(err);
          toast.error('Failed to delete project. Please try again.');
          setDeleteConfirmModal(prev => ({ ...prev, isProcessing: false }));
        }
      }
    });
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      (p.name && p.name.toLowerCase().includes(projectSearch.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(projectSearch.toLowerCase()));
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && (p.status === statusFilter || (!p.status && statusFilter === 'Completed Work'));
  });

  // =========================================================================
  // Date Helpers & Metrics
  // =========================================================================
  const todayStr = getTodayString();

  const formatLeadDate = (isoString) => {
    if (!isoString) return 'Date unknown';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      
      const leadDateStr = d.toISOString().slice(0, 10);
      const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      
      if (leadDateStr === todayStr) {
        return `Today at ${timeStr}`;
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      
      if (leadDateStr === yesterdayStr) {
        return `Yesterday at ${timeStr}`;
      }
      
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ` at ${timeStr}`;
    } catch {
      return isoString;
    }
  };

  const getWhatsAppHref = (phone, name, service) => {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(`Hello ${name || 'Sir/Madam'}, this is Jai Bhavani Constructions regarding your enquiry on our website for ${service || 'plumbing works'}. How can we assist you?`);
    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  // =========================================================================
  // Tab 3 Calculations: Quote Leads Management
  // =========================================================================
  const totalQuotesCount = quoteLeads.length;
  const todayQuotesCount = quoteLeads.filter(l => (l.submittedAt || '').slice(0, 10) === todayStr).length;
  const pendingQuotesCount = quoteLeads.filter(l => (l.status || 'Not Contacted') === 'Not Contacted').length;
  const contactedQuotesCount = quoteLeads.filter(l => l.status === 'Contacted').length;
  const convertedQuotesCount = quoteLeads.filter(l => l.status === 'Converted').length;
  const notConvertedQuotesCount = quoteLeads.filter(l => l.status === 'Not Converted').length;

  const handleUpdateQuoteStatus = async (lead, newStatus) => {
    try {
      await changeLeadStatus(lead.id, newStatus, 'quoteRequests');
      toast.success(`Quote lead status updated to "${newStatus}"!`);
    } catch (err) {
      console.error('Failed to update quote status:', err);
      toast.error('Failed to update status. Please try again.');
    }
  };

  const handleOpenEditQuote = (lead) => {
    setEditingQuoteLead(lead);
    setQuoteEditForm({
      fullName: lead.fullName || '',
      phone: lead.phone || '',
      email: lead.email || '',
      serviceRequired: lead.serviceRequired || '',
      projectType: lead.projectType || '',
      siteAddress: lead.siteAddress || lead.projectLocation || '',
      googleMapsLink: lead.googleMapsLink || '',
      status: lead.status || 'Not Contacted',
      message: lead.message || ''
    });
    setIsQuoteEditModalOpen(true);
  };

  const handleSaveQuoteEdit = async (e) => {
    e.preventDefault();
    if (!editingQuoteLead) return;
    try {
      await updateLeadDetails(editingQuoteLead.id, {
        fullName: quoteEditForm.fullName.trim(),
        phone: quoteEditForm.phone.trim(),
        email: quoteEditForm.email.trim(),
        serviceRequired: quoteEditForm.serviceRequired.trim(),
        projectType: quoteEditForm.projectType.trim(),
        siteAddress: quoteEditForm.siteAddress.trim(),
        googleMapsLink: quoteEditForm.googleMapsLink.trim(),
        status: quoteEditForm.status,
        message: quoteEditForm.message.trim()
      }, 'quoteRequests');
      toast.success('Quotation request updated successfully!');
      setIsQuoteEditModalOpen(false);
      setEditingQuoteLead(null);
    } catch (err) {
      console.error('Failed to update quote lead:', err);
      toast.error('Failed to update quote details.');
    }
  };

  const handleDeleteQuote = (lead) => {
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Delete Quotation Lead',
      itemName: lead.fullName || 'Customer Lead',
      description: `Are you sure you want to permanently delete the quotation request from "${lead.fullName || 'Customer'}" (${lead.serviceRequired || 'Plumbing Work'})? This enquiry cannot be recovered.`,
      confirmButtonText: 'Yes, Delete Lead',
      isDanger: true,
      isProcessing: false,
      onConfirm: async () => {
        setDeleteConfirmModal(prev => ({ ...prev, isProcessing: true }));
        try {
          await removeLead(lead.id, 'quoteRequests');
          toast.success('Quotation request deleted.');
          closeDeleteConfirmModal();
        } catch (err) {
          console.error('Failed to delete quote:', err);
          toast.error('Failed to delete quotation request.');
          setDeleteConfirmModal(prev => ({ ...prev, isProcessing: false }));
        }
      }
    });
  };

  const filteredQuotes = quoteLeads.filter(lead => {
    const q = quoteSearch.toLowerCase().trim();
    const matchesSearch = !q ||
      (lead.fullName && lead.fullName.toLowerCase().includes(q)) ||
      (lead.phone && lead.phone.toLowerCase().includes(q)) ||
      (lead.email && lead.email.toLowerCase().includes(q)) ||
      (lead.serviceRequired && lead.serviceRequired.toLowerCase().includes(q)) ||
      (lead.projectType && lead.projectType.toLowerCase().includes(q)) ||
      (lead.siteAddress && lead.siteAddress.toLowerCase().includes(q)) ||
      (lead.projectLocation && lead.projectLocation.toLowerCase().includes(q)) ||
      (lead.message && lead.message.toLowerCase().includes(q));

    const currentStatus = lead.status || 'Not Contacted';
    const matchesStatus = quoteStatusFilter === 'All' || currentStatus === quoteStatusFilter;

    const leadDateStr = (lead.submittedAt || '').slice(0, 10);
    let matchesDate = true;
    if (quoteDateFilterMode === 'today') {
      matchesDate = leadDateStr === todayStr;
    } else if (quoteDateFilterMode === 'custom') {
      matchesDate = leadDateStr === quoteCustomDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleOpenEditContact = (item) => {
    setEditingContactItem(item);
    setContactEditForm({
      fullName: item.fullName || '',
      phone: item.phone || '',
      email: item.email || '',
      serviceRequired: item.serviceRequired || '',
      message: item.message || ''
    });
    setIsContactEditModalOpen(true);
  };

  const handleSaveContactEdit = async (e) => {
    e.preventDefault();
    if (!editingContactItem) return;
    try {
      await updateLeadDetails(editingContactItem.id, {
        fullName: contactEditForm.fullName.trim(),
        phone: contactEditForm.phone.trim(),
        email: contactEditForm.email.trim(),
        serviceRequired: contactEditForm.serviceRequired.trim(),
        message: contactEditForm.message.trim()
      }, 'contactMessages');
      toast.success('Contact inquiry updated successfully!');
      setIsContactEditModalOpen(false);
      setEditingContactItem(null);
    } catch (err) {
      console.error('Failed to update contact message:', err);
      toast.error('Failed to update contact inquiry.');
    }
  };

  const handleDeleteContactInquiry = (item) => {
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Delete Contact Inquiry',
      itemName: item.fullName || 'Customer Message',
      description: `Are you sure you want to permanently delete the contact message inquiry from "${item.fullName || 'Customer'}"? This record will be permanently deleted from Firebase.`,
      confirmButtonText: 'Yes, Delete Inquiry',
      isDanger: true,
      isProcessing: false,
      onConfirm: async () => {
        setDeleteConfirmModal(prev => ({ ...prev, isProcessing: true }));
        try {
          await removeLead(item.id, 'contactMessages');
          toast.success('Contact inquiry deleted.');
          closeDeleteConfirmModal();
        } catch (err) {
          console.error('Failed to delete contact message:', err);
          toast.error('Failed to delete contact message.');
          setDeleteConfirmModal(prev => ({ ...prev, isProcessing: false }));
        }
      }
    });
  };

  // =========================================================================
  // Tab 4 Calculations: Contact Inquiries
  // =========================================================================
  const totalContactsCount = contactInquiries.length;
  const todayContactsCount = contactInquiries.filter(c => (c.submittedAt || '').slice(0, 10) === todayStr).length;
  const smallFixesCount = contactInquiries.filter(c => (c.serviceRequired || '').includes('Small Fixes')).length;
  const flatWorksCount = contactInquiries.filter(c => (c.serviceRequired || '').includes('Flat Works')).length;
  const buildingWorksCount = contactInquiries.filter(c => (c.serviceRequired || '').includes('Building Works')).length;

  const filteredContacts = contactInquiries.filter(item => {
    const q = contactSearch.toLowerCase().trim();
    const matchesSearch = !q || 
      (item.fullName && item.fullName.toLowerCase().includes(q)) ||
      (item.phone && item.phone.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.serviceRequired && item.serviceRequired.toLowerCase().includes(q)) ||
      (item.message && item.message.toLowerCase().includes(q));

    const matchesService = contactServiceFilter === 'All' || (item.serviceRequired && item.serviceRequired.includes(contactServiceFilter));

    const itemDateStr = (item.submittedAt || '').slice(0, 10);
    let matchesDate = true;
    if (contactDateFilterMode === 'today') {
      matchesDate = itemDateStr === todayStr;
    } else if (contactDateFilterMode === 'custom') {
      matchesDate = itemDateStr === contactCustomDate;
    }

    return matchesSearch && matchesService && matchesDate;
  });

  const tabsList = [
    {
      id: 'basic',
      name: '1. Basic Details',
      shortName: 'Basic Details',
      icon: Settings,
      desc: 'Phone, WhatsApp, Timings & Social Profiles',
      badge: null,
    },
    {
      id: 'projects',
      name: `2. Projects (${projects.length})`,
      shortName: 'Projects',
      icon: Layers,
      desc: 'Add, Edit & Manage Portfolio Showcase',
      badge: null,
    },
    {
      id: 'quoteLeads',
      name: `3. Quote Leads (${totalQuotesCount})`,
      shortName: 'Quote Leads',
      icon: Users,
      desc: 'Quotation Enquiries with Status Lifecycle',
      badge: pendingQuotesCount > 0 ? `${pendingQuotesCount} New` : null,
      badgeColor: 'bg-amber-500 text-black',
    },
    {
      id: 'contactInquiries',
      name: `4. Contact Inquiries (${totalContactsCount})`,
      shortName: 'Contact Inquiries',
      icon: Inbox,
      desc: 'Customer Inquiries & Messages Inbox',
      badge: todayContactsCount > 0 ? `${todayContactsCount} Today` : null,
      badgeColor: 'bg-emerald-500 text-black',
    },
  ];

  const currentTabObj = tabsList.find(t => t.id === activeTab) || tabsList[0];

  return (
    <div className="min-h-screen bg-[#071827] text-white flex flex-col font-sans">
      <SEO title="Admin Dashboard | Jai Bhavani Constructions" />

      {/* Top Navbar */}
      <header className="bg-[#051320] border-b border-white/10 sticky top-0 z-40 px-3.5 sm:px-8 py-3 flex items-center justify-between shadow-lg gap-2">
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-0.5 border border-brand-water/40 shadow-xs flex items-center justify-center shrink-0">
              <img src="/jbc-logo.png" alt="JBC" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-xs sm:text-base text-white tracking-tight leading-tight block truncate">
                JAI BHAVANI CONSTRUCTIONS
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-brand-water uppercase block">
                ADMIN CONTROL PANEL
              </span>
            </div>
          </Link>

          {/* Real-time Sync Indicator Badge */}
          <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Realtime Sync Active</span>
          </div>

          {/* JWT Cryptographic Security Status Badge */}
          <button
            type="button"
            onClick={() => setShowSecurityModal(true)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            title="Inspect 256-Bit Cryptographic JWT Identity Token & Session"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">JWT Secured</span>
            {timeRemainingFormatted && (
              <span className="text-[10px] bg-cyan-400/20 text-cyan-200 px-1.5 py-0.5 rounded font-mono">
                {timeRemainingFormatted}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Menu Quick Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="md:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-brand-water/15 hover:bg-brand-water/25 border border-brand-water/30 text-xs font-bold text-cyan-200 transition-all active:scale-95 cursor-pointer"
            aria-label="Open Navigation Tabs Menu"
          >
            <Menu className="w-3.5 h-3.5 text-brand-water" />
            <span className="text-[11px]">Tabs</span>
          </button>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 hover:text-white transition-colors"
          >
            <span className="hidden sm:inline">Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-water" />
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold text-red-300 hover:text-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* ========================================================================= */}
        {/* MOBILE NAVIGATION: Modern Interactive Tabs Selector & Menu Popover (md:hidden) */}
        {/* ========================================================================= */}
        <div className="md:hidden relative">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0b2138] border border-brand-water/40 text-white shadow-md active:scale-[0.99] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-brand-water/20 border border-brand-water/40 flex items-center justify-center text-brand-water shrink-0">
                <currentTabObj.icon className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-white tracking-wide truncate">
                    {currentTabObj.name}
                  </span>
                  {currentTabObj.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${currentTabObj.badgeColor}`}>
                      {currentTabObj.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block truncate">
                  Tap to switch tab ({tabsList.findIndex(t => t.id === activeTab) + 1} of 4)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-water/20 border border-brand-water/30 text-[11px] font-bold text-cyan-300 shrink-0 ml-2">
              <Menu className="w-3.5 h-3.5" />
              <span>Switch</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Mobile Menu Dropdown Modal / Overlay */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40" 
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Menu Popover Container */}
              <div className="absolute top-full left-0 right-0 mt-2 p-2.5 rounded-2xl bg-[#091b2e] border border-brand-water/40 shadow-2xl z-50 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Admin Dashboard Tab
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  {tabsList.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-brand-water via-[#0d6fa7] to-brand-water text-white shadow-md font-bold'
                            : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-300'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold leading-tight truncate">
                              {tab.name}
                            </p>
                            <p className={`text-[10px] mt-0.5 truncate ${
                              isActive ? 'text-cyan-100' : 'text-slate-400'
                            }`}>
                              {tab.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          {tab.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${tab.badgeColor}`}>
                              {tab.badge}
                            </span>
                          )}
                          {isActive && <Check className="w-4 h-4 text-white shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP & TABLET TAB NAVIGATION PILL BAR (hidden md:flex) */}
        {/* ========================================================================= */}
        <div className="hidden md:flex flex-wrap items-center justify-between gap-4 bg-[#0b2138] border border-white/10 p-1.5 rounded-2xl">
          <div className="flex flex-wrap items-center gap-2">
            {tabsList.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-water to-[#0d6fa7] text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${tab.badgeColor}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 px-3 hidden 2xl:block">
            Logged in as: <strong className="text-white">{currentUser?.email || 'Administrator'}</strong>
          </div>
        </div>

        {/* Global Action Banner Notification */}
        {projectActionStatus && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs font-bold flex items-center gap-2.5 shadow-md animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{projectActionStatus}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: BASIC DETAILS & SOCIAL LINKS */}
        {/* ========================================================================= */}
        {activeTab === 'basic' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {saveStatus && (
              <div className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2.5 shadow-md ${
                saveStatus === 'success' 
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200' 
                  : 'bg-red-500/15 border-red-500/30 text-red-200'
              }`}>
                {saveStatus === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                <span>{saveMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveBasicDetails} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Contact Information Card */}
                <div className="bg-[#0b2138] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-brand-water/20 text-brand-water flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Contact Details</h3>
                      <p className="text-xs text-slate-400">Updates live across whole website header, footer & hero</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Primary Phone Number
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 98925 57166"
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-brand-water focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                        placeholder="+91 99874 43006"
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-brand-water focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Official Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="jaibhavaiconstructions@gmail.com"
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-brand-water focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Working Hours Card */}
                <div className="bg-[#0b2138] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-brand-water/20 text-brand-water flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Working Hours</h3>
                      <p className="text-xs text-slate-400">Controls operating schedule displayed on contact page</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Monday - Saturday Timing
                      </label>
                      <input
                        type="text"
                        value={formData.weekdayHours}
                        onChange={(e) => setFormData(prev => ({ ...prev, weekdayHours: e.target.value }))}
                        placeholder="9:00 AM - 6:00 PM"
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-brand-water focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Sunday Timing
                      </label>
                      <input
                        type="text"
                        value={formData.sundayHours}
                        onChange={(e) => setFormData(prev => ({ ...prev, sundayHours: e.target.value }))}
                        placeholder="9:00 AM - 2:00 PM (or Closed)"
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-brand-water focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Social Channels Card */}
              <div className="bg-[#0b2138] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-water/20 text-brand-water flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Social Media Profiles</h3>
                      <p className="text-xs text-slate-400">Manage all live external links displayed in the footer</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingSocial(!isAddingSocial)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-brand-water transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingSocial ? 'Cancel' : 'Add New Platform'}</span>
                  </button>
                </div>

                {/* Add Custom Social Box */}
                {isAddingSocial && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/15 space-y-3 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Platform Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. LinkedIn, Twitter, JustDial"
                          value={newPlatformName}
                          onChange={(e) => setNewPlatformName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Profile URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={newPlatformUrl}
                          onChange={(e) => setNewPlatformUrl(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSocialPlatform}
                      className="px-4 py-2 rounded-lg bg-brand-water text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Confirm Add
                    </button>
                  </div>
                )}

                {/* Social Links List */}
                <div className="space-y-3 pt-2">
                  {socialLinks.map((social) => (
                    <div 
                      key={social.id} 
                      className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {social.key === 'yt' && <FaYoutube className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />}
                          {social.key === 'insta' && <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 shrink-0" />}
                          {social.key === 'facebook' && <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />}
                          {social.key !== 'yt' && social.key !== 'insta' && social.key !== 'facebook' && <Share2 className="w-4 h-4 text-brand-water shrink-0" />}
                          <span className="text-xs font-bold text-white truncate">{social.platform}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSocial(social.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                          title="Remove Platform"
                          aria-label={`Remove ${social.platform}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="w-full">
                        <input
                          type="url"
                          value={social.url}
                          onChange={(e) => handleSocialUrlChange(social.id, e.target.value)}
                          placeholder="Enter social profile link (https://...)"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-water via-[#1080bd] to-[#0d6fa7] hover:from-[#1da3ec] hover:to-brand-water text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-water/20 hover:shadow-brand-water/40 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {isSaving ? 'Saving Realtime Changes...' : '💾 Save All Basic Details'}
                </button>
              </div>
            </form>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MANAGE PROJECTS */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0b2138] border border-white/10 p-5 rounded-2xl shadow-xl">
              
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search projects by name or location..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-slate-400 focus:border-brand-water focus:outline-none"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#0b2138]">All Statuses</option>
                  <option value="Completed Work" className="bg-[#0b2138]">Completed Work</option>
                  <option value="Ongoing" className="bg-[#0b2138]">Ongoing</option>
                  <option value="Yet to Start" className="bg-[#0b2138]">Yet to Start</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSeedProjects}
                  disabled={isSeeding}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                  title="Upload all 55 default Mumbai projects into Firebase Firestore database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-brand-water ${isSeeding ? 'animate-spin' : ''}`} />
                  <span>{isSeeding ? 'Uploading 55 Projects...' : 'Upload 55 Projects to Firebase'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddProject}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-water to-[#0d6fa7] hover:from-[#1da3ec] hover:to-brand-water text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-water/20 hover:shadow-brand-water/40 transition-all cursor-pointer active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Project</span>
                </button>
              </div>
            </div>

            {/* Project List / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((proj, index) => (
                <div 
                  key={proj.id} 
                  className="bg-[#0b2138] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl group transition-all"
                >
                  <div>
                    {/* Image / Header Thumbnail */}
                    <div className="relative aspect-[16/9] bg-black/40 overflow-hidden border-b border-white/10">
                      {proj.image ? (
                        <img 
                          src={proj.image} 
                          alt={proj.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#071827] to-[#0e2c4d]">
                          <ImageIcon className="w-8 h-8 text-slate-500 mb-1" />
                          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider text-center">No Photo (Banner View)</span>
                        </div>
                      )}

                      {/* Status Tag on Thumbnail */}
                      <div className="absolute top-2.5 right-2.5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-md ${
                          proj.status === 'Ongoing'
                            ? 'bg-amber-500 text-black'
                            : proj.status === 'Yet to Start'
                            ? 'bg-sky-500 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}>
                          {proj.status || 'Completed Work'}
                        </span>
                      </div>

                      {/* Newest tag for top items */}
                      {index === 0 && (
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-water text-white shadow-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Latest</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-brand-water font-semibold">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{proj.location || 'Mumbai'}</span>
                      </div>

                      <h4 className="text-base font-bold text-white tracking-tight leading-snug">
                        {proj.name}
                      </h4>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {proj.description || 'No overview provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-5 py-3.5 bg-black/20 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenEditProject(proj)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-brand-water transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj.id, proj.name)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16 bg-[#0b2138] border border-white/10 rounded-2xl space-y-3">
                <Info className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-200">No projects found matching your search filter.</p>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: QUOTE LEADS MANAGEMENT (QUOTATION FORM ONLY WITH LIFECYCLE STATUS) */}
        {/* ========================================================================= */}
        {activeTab === 'quoteLeads' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top KPI Metrics Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
              
              {/* Metric 1: Total Quote Leads */}
              <button
                type="button"
                onClick={() => { setQuoteStatusFilter('All'); setQuoteDateFilterMode('all'); }}
                className="bg-[#0b2138] hover:bg-[#0e2c4d] border border-white/10 hover:border-brand-water/40 rounded-2xl p-3 sm:p-4 text-left shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-slate-400 group-hover:text-brand-water mb-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Total Quotes</span>
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {totalQuotesCount}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">
                  All requests
                </div>
              </button>

              {/* Metric 2: Today's Quotes */}
              <button
                type="button"
                onClick={() => { setQuoteDateFilterMode('today'); }}
                className={`bg-[#0b2138] hover:bg-[#0e2c4d] border rounded-2xl p-3 sm:p-4 text-left shadow-lg transition-all cursor-pointer group ${
                  quoteDateFilterMode === 'today' ? 'border-brand-water bg-brand-water/10' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-brand-water mb-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Today's Quotes</span>
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-brand-water tracking-tight">
                  {todayQuotesCount}
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5 font-medium truncate">
                  Received today
                </div>
              </button>

              {/* Metric 3: Not Contacted (Pending) */}
              <button
                type="button"
                onClick={() => { setQuoteStatusFilter('Not Contacted'); }}
                className={`bg-[#0b2138] hover:bg-[#0e2c4d] border rounded-2xl p-3 sm:p-4 text-left shadow-lg transition-all cursor-pointer group ${
                  quoteStatusFilter === 'Not Contacted' ? 'border-amber-500 bg-amber-500/10' : 'border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between text-amber-400 mb-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Not Contacted</span>
                  <Clock3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
                  {pendingQuotesCount}
                </div>
                <div className="text-[10px] text-amber-200/70 mt-0.5 font-medium truncate">
                  Awaiting response
                </div>
              </button>

              {/* Metric 4: Contacted */}
              <button
                type="button"
                onClick={() => { setQuoteStatusFilter('Contacted'); }}
                className={`bg-[#0b2138] hover:bg-[#0e2c4d] border rounded-2xl p-3 sm:p-4 text-left shadow-lg transition-all cursor-pointer group ${
                  quoteStatusFilter === 'Contacted' ? 'border-sky-500 bg-sky-500/10' : 'border-sky-500/30'
                }`}
              >
                <div className="flex items-center justify-between text-sky-400 mb-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Contacted</span>
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-sky-300 tracking-tight">
                  {contactedQuotesCount}
                </div>
                <div className="text-[10px] text-sky-200/70 mt-0.5 font-medium truncate">
                  In discussion
                </div>
              </button>

              {/* Metric 5: Converted */}
              <button
                type="button"
                onClick={() => { setQuoteStatusFilter('Converted'); }}
                className={`bg-[#0b2138] hover:bg-[#0e2c4d] border rounded-2xl p-3 sm:p-4 text-left shadow-lg transition-all cursor-pointer group ${
                  quoteStatusFilter === 'Converted' ? 'border-emerald-500 bg-emerald-500/10' : 'border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between text-emerald-400 mb-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Converted</span>
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-300 tracking-tight">
                  {convertedQuotesCount}
                </div>
                <div className="text-[10px] text-emerald-200/70 mt-0.5 font-medium truncate">
                  Won orders
                </div>
              </button>

              {/* Metric 6: Not Converted */}
              <button
                type="button"
                onClick={() => { setQuoteStatusFilter('Not Converted'); }}
                className={`bg-[#0b2138] hover:bg-[#0e2c4d] border rounded-2xl p-3 sm:p-4 text-left shadow-lg transition-all cursor-pointer group ${
                  quoteStatusFilter === 'Not Converted' ? 'border-rose-500 bg-rose-500/10' : 'border-rose-500/30'
                }`}
              >
                <div className="flex items-center justify-between text-rose-400 mb-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Not Converted</span>
                  <UserX className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-rose-300 tracking-tight">
                  {notConvertedQuotesCount}
                </div>
                <div className="text-[10px] text-rose-200/70 mt-0.5 font-medium truncate">
                  Closed / dropped
                </div>
              </button>

            </div>

            {/* Filter & Control Toolbar */}
            <div className="bg-[#0b2138] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5 sm:space-y-4">
              
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search quote leads by name, mobile, service..."
                    value={quoteSearch}
                    onChange={(e) => setQuoteSearch(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-slate-400 focus:border-brand-water focus:outline-none"
                  />
                  {quoteSearch && (
                    <button
                      type="button"
                      onClick={() => setQuoteSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Date Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuoteDateFilterMode('today')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      quoteDateFilterMode === 'today'
                        ? 'bg-brand-water text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Today</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuoteDateFilterMode('all')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      quoteDateFilterMode === 'all'
                        ? 'bg-brand-water text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    <span>All Dates</span>
                  </button>

                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Date:</span>
                    <input
                      type="date"
                      value={quoteCustomDate}
                      onChange={(e) => {
                        setQuoteCustomDate(e.target.value);
                        setQuoteDateFilterMode('custom');
                      }}
                      className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

              </div>

              {/* Status Filter Pills Bar (Smooth horizontal scroll on mobile) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-white/10 text-xs">
                
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1 flex items-center gap-1 shrink-0">
                    <Filter className="w-3 h-3 text-brand-water" />
                    <span>Status:</span>
                  </span>

                  {[
                    { id: 'All', label: 'All Statuses' },
                    { id: 'Not Contacted', label: '⏳ Not Contacted' },
                    { id: 'Contacted', label: '📞 Contacted' },
                    { id: 'Converted', label: '🏆 Converted' },
                    { id: 'Not Converted', label: '✖ Not Converted' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setQuoteStatusFilter(tab.id)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                        quoteStatusFilter === tab.id
                          ? 'bg-white/20 text-white border border-white/40 shadow-xs'
                          : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {(quoteSearch || quoteStatusFilter !== 'All' || quoteDateFilterMode !== 'today') && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuoteSearch('');
                      setQuoteStatusFilter('All');
                      setQuoteDateFilterMode('today');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                    title="Reset quote filters"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Filters</span>
                  </button>
                )}

              </div>

            </div>

            {/* Header Status Bar & View Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 px-1">
              <div className="flex flex-wrap items-center gap-2">
                <span>
                  Showing <strong className="text-white font-bold">{filteredQuotes.length}</strong> of {totalQuotesCount} quotation requests
                  {quoteDateFilterMode === 'today' && <span className="text-brand-water font-semibold ml-1.5">(Today)</span>}
                  {quoteDateFilterMode === 'custom' && <span className="text-brand-water font-semibold ml-1.5">({quoteCustomDate})</span>}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Live Sync</span>
                </span>
              </div>

              {/* View Switcher: Table vs Cards */}
              <div className="flex items-center gap-1 bg-[#051320] p-1 rounded-xl border border-white/10 self-start sm:self-auto shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuoteViewMode('table')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    quoteViewMode === 'table'
                      ? 'bg-brand-water text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Table View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuoteViewMode('card')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    quoteViewMode === 'card'
                      ? 'bg-brand-water text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Card View</span>
                </button>
              </div>
            </div>

            {/* Quote Leads: Table View */}
            {quoteViewMode === 'table' ? (
              <div className="bg-[#0b2138] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1100px]">
                    <thead>
                      <tr className="bg-[#051320] border-b border-white/10 text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                        <th className="py-3.5 px-4 text-center w-16">Sr. No</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Date & Time</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Customer Name</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Phone / WhatsApp</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Email</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Service & Type</th>
                        <th className="py-3.5 px-4">Site Location</th>
                        <th className="py-3.5 px-4">Quotation Scope</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                        <th className="py-3.5 px-4 text-center whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-slate-200">
                      {filteredQuotes.map((lead, index) => {
                        const currentStatus = lead.status || 'Not Contacted';
                        return (
                          <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                            {/* Sr. No */}
                            <td className="py-3.5 px-4 text-center font-mono font-bold text-brand-water">
                              #{index + 1}
                            </td>

                            {/* Date & Time */}
                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 font-medium">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{formatLeadDate(lead.submittedAt)}</span>
                              </span>
                            </td>

                            {/* Customer Name */}
                            <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                              {lead.fullName || 'Anonymous'}
                            </td>

                            {/* Phone & WhatsApp */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{lead.phone || '—'}</span>
                                {lead.phone && (
                                  <div className="flex items-center gap-1">
                                    <a
                                      href={`tel:${lead.phone}`}
                                      className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
                                      title="Call directly"
                                    >
                                      <Phone className="w-3 h-3" />
                                    </a>
                                    <a
                                      href={getWhatsAppHref(lead.phone, lead.fullName, lead.serviceRequired)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                                      title="Message on WhatsApp"
                                    >
                                      <FaWhatsapp className="w-3 h-3 text-[#25D366]" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Email */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {lead.email ? (
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="text-slate-300 hover:text-brand-water transition-colors inline-flex items-center gap-1"
                                >
                                  <span>{lead.email}</span>
                                </a>
                              ) : (
                                <span className="text-slate-500 italic">—</span>
                              )}
                            </td>

                            {/* Service & Type */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-1 max-w-[160px]">
                                <span className="font-bold text-brand-water truncate">
                                  {lead.serviceRequired || 'Plumbing Work'}
                                </span>
                                {lead.projectType && (
                                  <span className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded w-fit truncate">
                                    {lead.projectType}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Site Location */}
                            <td className="py-3.5 px-4 max-w-[180px]">
                              <div className="space-y-1">
                                <p className="truncate text-white font-medium" title={lead.siteAddress || lead.projectLocation}>
                                  {lead.siteAddress || lead.projectLocation || '—'}
                                </p>
                                {lead.googleMapsLink && (
                                  <a
                                    href={lead.googleMapsLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:underline"
                                  >
                                    <MapPin className="w-2.5 h-2.5" />
                                    <span>Maps Pin</span>
                                  </a>
                                )}
                              </div>
                            </td>

                            {/* Scope */}
                            <td className="py-3.5 px-4 max-w-[200px]">
                              <p className="line-clamp-2 text-slate-300 italic" title={lead.message}>
                                {lead.message ? `"${lead.message}"` : '—'}
                              </p>
                            </td>

                            {/* Status Selector */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <select
                                value={currentStatus}
                                onChange={(e) => handleUpdateQuoteStatus(lead, e.target.value)}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border cursor-pointer focus:outline-none ${
                                  currentStatus === 'Not Contacted'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    : currentStatus === 'Contacted'
                                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                    : currentStatus === 'Converted'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                }`}
                              >
                                <option value="Not Contacted" className="bg-[#071827] text-amber-300">⏳ Not Contacted</option>
                                <option value="Contacted" className="bg-[#071827] text-sky-300">📞 Contacted</option>
                                <option value="Converted" className="bg-[#071827] text-emerald-300">🏆 Converted</option>
                                <option value="Not Converted" className="bg-[#071827] text-rose-300">✖ Not Converted</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditQuote(lead)}
                                  className="p-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
                                  title="Edit quotation lead details"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteQuote(lead)}
                                  className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 hover:text-red-200 transition-colors cursor-pointer"
                                  title="Delete lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Quote Leads: Card View (1-col on mobile, 2-col on tablet/desktop) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {filteredQuotes.map((lead, index) => {
                  const currentStatus = lead.status || 'Not Contacted';

                  return (
                    <div 
                      key={lead.id} 
                      onClick={() => setViewingQuoteDetail(lead)}
                      className="bg-[#0b2138] hover:bg-[#0e2c4d] border border-white/10 hover:border-brand-water/40 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group relative"
                    >
                      {/* Top Row: Sr. No, Name & Status Pill */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-brand-water/20 text-brand-water border border-brand-water/30 shrink-0 shadow-xs">
                            #{index + 1}
                          </span>
                          <h3 className="text-sm font-bold text-white truncate group-hover:text-brand-water transition-colors">
                            {lead.fullName || 'Anonymous Customer'}
                          </h3>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold shrink-0 border ${
                          currentStatus === 'Not Contacted' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                          currentStatus === 'Contacted' ? 'bg-sky-500/15 text-sky-300 border-sky-500/30' :
                          currentStatus === 'Converted' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                          'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}>
                          {currentStatus}
                        </span>
                      </div>

                      {/* Middle Row: Service Requested & Relative Time */}
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300 min-w-0">
                          <span className="text-brand-water">🔧</span>
                          <span className="font-semibold text-slate-200 truncate">
                            {lead.serviceRequired || 'Quotation Request'}
                          </span>
                          {lead.projectType && (
                            <span className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded truncate hidden sm:inline">
                              {lead.projectType}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-slate-400 text-[11px] shrink-0">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{formatLeadDate(lead.submittedAt)}</span>
                        </div>
                      </div>

                      {/* Location / Scope Summary Snippet */}
                      {(lead.siteAddress || lead.projectLocation || lead.message) && (
                        <p className="text-xs text-slate-400 line-clamp-1 italic">
                          {lead.siteAddress || lead.projectLocation ? `📍 ${lead.siteAddress || lead.projectLocation}` : `💬 "${lead.message}"`}
                        </p>
                      )}

                      {/* Bottom Row: Quick Contact & Action Buttons */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-xs">
                        {/* Quick Contact Buttons (Call & WhatsApp) */}
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {lead.phone ? (
                            <>
                              <a
                                href={`tel:${lead.phone}`}
                                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                                title="Call directly"
                              >
                                <Phone className="w-3 h-3 text-brand-water" />
                                <span>Call</span>
                              </a>
                              <a
                                href={getWhatsAppHref(lead.phone, lead.fullName, lead.serviceRequired)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold transition-colors flex items-center gap-1"
                                title="WhatsApp chat"
                              >
                                <FaWhatsapp className="w-3 h-3 text-[#25D366]" />
                                <span>Chat</span>
                              </a>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-500">No phone</span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setViewingQuoteDetail(lead)}
                            className="px-2 py-1 rounded-lg bg-brand-water/15 hover:bg-brand-water/25 border border-brand-water/30 text-brand-water text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="View full lead details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditQuote(lead)}
                            className="p-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
                            title="Edit details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteQuote(lead)}
                            className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 hover:text-red-200 transition-colors cursor-pointer"
                            title="Delete lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {filteredQuotes.length === 0 && (
              <div className="text-center py-16 bg-[#0b2138] border border-white/10 rounded-2xl space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center mx-auto border border-white/10">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">No Quotation Requests Found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    {quoteDateFilterMode === 'today'
                      ? 'No quotation requests were received today yet.'
                      : 'No quotation leads match the selected search, status, or date filters.'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setQuoteSearch('');
                      setQuoteStatusFilter('All');
                      setQuoteDateFilterMode('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-water hover:bg-[#1da3ec] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View All Time Quotes ({totalQuotesCount})
                  </button>

                  <Link
                    to="/request-a-quote"
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Open Quote Page ↗
                  </Link>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CONTACT INQUIRIES (CONTACT US FORM ONLY - CLEAN VIEW-ONLY INBOX) */}
        {/* ========================================================================= */}
        {activeTab === 'contactInquiries' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top KPI Metrics Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
              
              {/* Metric 1: Total Contact Inquiries */}
              <button
                type="button"
                onClick={() => { setContactServiceFilter('All'); setContactDateFilterMode('all'); }}
                className="bg-[#0b2138] hover:bg-[#0e2c4d] border border-white/10 hover:border-brand-water/40 rounded-2xl p-3 sm:p-4 text-left shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-slate-400 group-hover:text-brand-water mb-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Total Inquiries</span>
                  <Inbox className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {totalContactsCount}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">
                  Messages received
                </div>
              </button>

              {/* Metric 2: Today's Inquiries */}
              <button
                type="button"
                onClick={() => { setContactDateFilterMode('today'); }}
                className={`bg-[#0b2138] hover:bg-[#0e2c4d] border rounded-2xl p-3 sm:p-4 text-left shadow-lg transition-all cursor-pointer group ${
                  contactDateFilterMode === 'today' ? 'border-brand-water bg-brand-water/10' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-brand-water mb-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Today's Inquiries</span>
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-brand-water tracking-tight">
                  {todayContactsCount}
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5 font-medium truncate">
                  Received today
                </div>
              </button>

              {/* Metric 3: Small Fixes */}
              <button
                type="button"
                onClick={() => { setContactServiceFilter('Small Fixes'); }}
                className={`bg-[#0b2138] hover:bg-[#0e2c4d] border rounded-2xl p-3 sm:p-4 text-left shadow-lg transition-all cursor-pointer group ${
                  contactServiceFilter === 'Small Fixes' ? 'border-sky-500 bg-sky-500/10' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-sky-400 mb-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Small Fixes</span>
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-sky-300 tracking-tight">
                  {smallFixesCount}
                </div>
                <div className="text-[10px] text-sky-200/70 mt-0.5 font-medium truncate">
                  Repairs & fixes
                </div>
              </button>

              {/* Metric 4: Flat Works */}
              <button
                type="button"
                onClick={() => { setContactServiceFilter('Flat Works'); }}
                className={`bg-[#0b2138] hover:bg-[#0e2c4d] border rounded-2xl p-3 sm:p-4 text-left shadow-lg transition-all cursor-pointer group ${
                  contactServiceFilter === 'Flat Works' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-emerald-400 mb-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Flat Works</span>
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-300 tracking-tight">
                  {flatWorksCount}
                </div>
                <div className="text-[10px] text-emerald-200/70 mt-0.5 font-medium truncate">
                  Renovations
                </div>
              </button>

              {/* Metric 5: Building Works (Spans 2 columns on mobile so it never gets orphaned!) */}
              <button
                type="button"
                onClick={() => { setContactServiceFilter('Building Works'); }}
                className={`col-span-2 sm:col-span-1 bg-[#0b2138] hover:bg-[#0e2c4d] border rounded-2xl p-3 sm:p-4 text-left shadow-lg transition-all cursor-pointer group ${
                  contactServiceFilter === 'Building Works' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-purple-400 mb-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Building Works</span>
                  <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-purple-300 tracking-tight">
                  {buildingWorksCount}
                </div>
                <div className="text-[10px] text-purple-200/70 mt-0.5 font-medium truncate">
                  Society CHS & Civil
                </div>
              </button>

            </div>

            {/* Filter & Control Toolbar */}
            <div className="bg-[#0b2138] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5 sm:space-y-4">
              
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search inquiries by name, mobile, service..."
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-slate-400 focus:border-brand-water focus:outline-none"
                  />
                  {contactSearch && (
                    <button
                      type="button"
                      onClick={() => setContactSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Date Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setContactDateFilterMode('today')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      contactDateFilterMode === 'today'
                        ? 'bg-brand-water text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Today</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContactDateFilterMode('all')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      contactDateFilterMode === 'all'
                        ? 'bg-brand-water text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    <span>All Dates</span>
                  </button>

                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Date:</span>
                    <input
                      type="date"
                      value={contactCustomDate}
                      onChange={(e) => {
                        setContactCustomDate(e.target.value);
                        setContactDateFilterMode('custom');
                      }}
                      className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

              </div>

              {/* Service Filter Row (Smooth horizontal scroll on mobile) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-white/10 text-xs">
                
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1 flex items-center gap-1 shrink-0">
                    <Filter className="w-3 h-3 text-brand-water" />
                    <span>Service:</span>
                  </span>

                  {[
                    { id: 'All', label: 'All Services' },
                    { id: 'Small Fixes', label: '🔧 Small Fixes' },
                    { id: 'Flat Works', label: '🛁 Flat Works' },
                    { id: 'Building Works', label: '🏢 Building Works' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setContactServiceFilter(tab.id)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                        contactServiceFilter === tab.id
                          ? 'bg-white/20 text-white border border-white/40 shadow-xs'
                          : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {(contactSearch || contactServiceFilter !== 'All' || contactDateFilterMode !== 'today') && (
                  <button
                    type="button"
                    onClick={() => {
                      setContactSearch('');
                      setContactServiceFilter('All');
                      setContactDateFilterMode('today');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                    title="Reset contact filters"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Filters</span>
                  </button>
                )}

              </div>

            </div>

            {/* Header Status Bar & View Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 px-1">
              <div className="flex flex-wrap items-center gap-2">
                <span>
                  Showing <strong className="text-white font-bold">{filteredContacts.length}</strong> of {totalContactsCount} contact inquiries
                  {contactDateFilterMode === 'today' && <span className="text-brand-water font-semibold ml-1.5">(Today)</span>}
                  {contactDateFilterMode === 'custom' && <span className="text-brand-water font-semibold ml-1.5">({contactCustomDate})</span>}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Live Sync</span>
                </span>
              </div>

              {/* View Switcher: Table vs Cards */}
              <div className="flex items-center gap-1 bg-[#051320] p-1 rounded-xl border border-white/10 self-start sm:self-auto shadow-xs">
                <button
                  type="button"
                  onClick={() => setContactViewMode('table')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    contactViewMode === 'table'
                      ? 'bg-brand-water text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Table View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContactViewMode('card')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    contactViewMode === 'card'
                      ? 'bg-brand-water text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Card View</span>
                </button>
              </div>
            </div>

            {/* Contact Inquiries: Table View */}
            {contactViewMode === 'table' ? (
              <div className="bg-[#0b2138] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[950px]">
                    <thead>
                      <tr className="bg-[#051320] border-b border-white/10 text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                        <th className="py-3.5 px-4 text-center w-16">Sr. No</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Date & Time</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Customer Name</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Phone / WhatsApp</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Email</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Service Requested</th>
                        <th className="py-3.5 px-4">Message / Query Details</th>
                        <th className="py-3.5 px-4 text-center whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-slate-200">
                      {filteredContacts.map((item, index) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                          {/* Sr. No */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-brand-water">
                            #{index + 1}
                          </td>

                          {/* Date & Time */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{formatLeadDate(item.submittedAt)}</span>
                            </span>
                          </td>

                          {/* Customer Name */}
                          <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                            {item.fullName || 'Anonymous'}
                          </td>

                          {/* Phone & WhatsApp */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{item.phone || '—'}</span>
                              {item.phone && (
                                <div className="flex items-center gap-1">
                                  <a
                                    href={`tel:${item.phone}`}
                                    className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
                                    title="Call directly"
                                  >
                                    <Phone className="w-3 h-3" />
                                  </a>
                                  <a
                                    href={getWhatsAppHref(item.phone, item.fullName, item.serviceRequired)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                                    title="Message on WhatsApp"
                                  >
                                    <FaWhatsapp className="w-3 h-3 text-[#25D366]" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Email */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {item.email ? (
                              <a
                                href={`mailto:${item.email}`}
                                className="text-slate-300 hover:text-brand-water transition-colors inline-flex items-center gap-1"
                              >
                                <span>{item.email}</span>
                              </a>
                            ) : (
                              <span className="text-slate-500 italic">—</span>
                            )}
                          </td>

                          {/* Service Requested */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-md bg-brand-water/15 text-brand-water border border-brand-water/20 text-[11px] font-bold inline-block">
                              🔧 {item.serviceRequired || 'General Plumbing'}
                            </span>
                          </td>

                          {/* Message */}
                          <td className="py-3.5 px-4 max-w-[260px]">
                            <p className="line-clamp-2 text-slate-300 italic" title={item.message}>
                              {item.message ? `"${item.message}"` : <span className="text-slate-500 not-italic">Standard enquiry</span>}
                            </p>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditContact(item)}
                                className="p-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
                                title="Edit contact message details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteContactInquiry(item)}
                                className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 hover:text-red-200 transition-colors cursor-pointer"
                                title="Delete inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Contact Inquiries: Card View (1-col on mobile, 2-col on tablet/desktop) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {filteredContacts.map((item, index) => (
                  <div 
                    key={item.id} 
                    onClick={() => setViewingContactDetail(item)}
                    className="bg-[#0b2138] hover:bg-[#0e2c4d] border border-white/10 hover:border-brand-water/40 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group relative"
                  >
                    {/* Top Row: Sr. No, Name & Service Pill */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-brand-water/20 text-brand-water border border-brand-water/30 shrink-0 shadow-xs">
                          #{index + 1}
                        </span>
                        <h3 className="text-sm font-bold text-white truncate group-hover:text-brand-water transition-colors">
                          {item.fullName || 'Anonymous Customer'}
                        </h3>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold shrink-0 bg-brand-water/15 text-brand-water border border-brand-water/30 truncate">
                        🔧 {item.serviceRequired || 'Inquiry'}
                      </span>
                    </div>

                    {/* Middle Row: Message snippet & Timestamp */}
                    <div className="space-y-1.5">
                      <p className="text-xs text-slate-300 line-clamp-2 italic leading-relaxed">
                        {item.message ? `"${item.message}"` : <span className="text-slate-500 not-italic">Standard contact enquiry</span>}
                      </p>
                      <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{formatLeadDate(item.submittedAt)}</span>
                      </div>
                    </div>

                    {/* Bottom Row: Quick Contact & Action Buttons */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-xs">
                      {/* Quick Contact Buttons (Call & WhatsApp) */}
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {item.phone ? (
                          <>
                            <a
                              href={`tel:${item.phone}`}
                              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                              title="Call directly"
                            >
                              <Phone className="w-3 h-3 text-brand-water" />
                              <span>Call</span>
                            </a>
                            <a
                              href={getWhatsAppHref(item.phone, item.fullName, item.serviceRequired)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold transition-colors flex items-center gap-1"
                              title="WhatsApp chat"
                            >
                              <FaWhatsapp className="w-3 h-3 text-[#25D366]" />
                              <span>Chat</span>
                            </a>
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-500">No phone</span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setViewingContactDetail(item)}
                          className="px-2 py-1 rounded-lg bg-brand-water/15 hover:bg-brand-water/25 border border-brand-water/30 text-brand-water text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="View full message details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditContact(item)}
                          className="p-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
                          title="Edit details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteContactInquiry(item)}
                          className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 hover:text-red-200 transition-colors cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredContacts.length === 0 && (
              <div className="text-center py-16 bg-[#0b2138] border border-white/10 rounded-2xl space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center mx-auto border border-white/10">
                  <Inbox className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">No Contact Inquiries Found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    {contactDateFilterMode === 'today'
                      ? 'No contact form enquiries were received today yet.'
                      : 'No contact inquiries match the selected search, service, or date filters.'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setContactSearch('');
                      setContactServiceFilter('All');
                      setContactDateFilterMode('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-water hover:bg-[#1da3ec] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View All Time Inquiries ({totalContactsCount})
                  </button>

                  <Link
                    to="/contact"
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Open Contact Page ↗
                  </Link>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PROJECT */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b2138] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-water/20 text-brand-water flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  {editingProjectId ? 'Edit Project Details' : 'Add New Project'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Project / Society Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter project or society name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-brand-water focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location (e.g. Kandivali West, Borivali)"
                    value={projectForm.location}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, location: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-brand-water focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Project Status *
                  </label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#071827] border border-white/15 text-white text-sm focus:border-brand-water focus:outline-none cursor-pointer"
                  >
                    <option value="Completed Work">Completed Work</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Yet to Start">Yet to Start</option>
                  </select>
                </div>
              </div>

              {/* Cloud Image Upload Field with Max 2MB Limit */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Project Photo (Free Cloud Sync)
                  </label>
                  <span className="text-[11px] text-brand-water font-semibold">Max 2MB</span>
                </div>

                {/* Upload Error Alert */}
                {uploadError && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Image Preview & Upload Box */}
                {projectForm.image ? (
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/40 p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/50 shrink-0 border border-white/10">
                        <img 
                          src={projectForm.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>Image Attached</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-[220px] sm:max-w-xs">
                          {projectForm.image}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setProjectForm(prev => ({ ...prev, image: '' }))}
                      className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    uploadingImage 
                      ? 'border-brand-water bg-brand-water/5 pointer-events-none' 
                      : 'border-white/20 hover:border-brand-water hover:bg-white/5'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                      className="hidden"
                    />

                    {uploadingImage ? (
                      <div className="w-full space-y-2 text-center py-2">
                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-brand-water">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Optimizing & Syncing Image... {uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-brand-water h-full transition-all duration-200" 
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-brand-water/15 text-brand-water flex items-center justify-center">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-bold text-white block">Click to Upload Image from Device</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">100% Free Cloud Sync • Limit 2MB (Auto-optimized)</span>
                        </div>
                      </>
                    )}
                  </label>
                )}

                {/* Direct URL Input Alternative */}
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Or paste external image URL / path (optional)"
                    value={projectForm.image}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 focus:border-brand-water focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Leave empty for society name banner view.</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Overview About Project *
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter project overview and scope of plumbing works..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-brand-water focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-water to-[#0d6fa7] hover:from-[#1da3ec] hover:to-brand-water text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  {editingProjectId ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT QUOTATION LEAD */}
      {/* ========================================================================= */}
      {isQuoteEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b2138] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Edit Quotation Request
                  </h3>
                  <p className="text-[11px] text-slate-400">Update customer details, status and scope</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsQuoteEditModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuoteEdit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  value={quoteEditForm.fullName}
                  onChange={(e) => setQuoteEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                  placeholder="Customer Name"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={quoteEditForm.phone}
                    onChange={(e) => setQuoteEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={quoteEditForm.email}
                    onChange={(e) => setQuoteEditForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="customer@email.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Service Required
                  </label>
                  <input
                    type="text"
                    value={quoteEditForm.serviceRequired}
                    onChange={(e) => setQuoteEditForm(prev => ({ ...prev, serviceRequired: e.target.value }))}
                    placeholder="e.g. Building Plumbing, Flat Work"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Project Type
                  </label>
                  <input
                    type="text"
                    value={quoteEditForm.projectType}
                    onChange={(e) => setQuoteEditForm(prev => ({ ...prev, projectType: e.target.value }))}
                    placeholder="e.g. Society CHS, Private Flat"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Site Location / Address
                </label>
                <input
                  type="text"
                  value={quoteEditForm.siteAddress}
                  onChange={(e) => setQuoteEditForm(prev => ({ ...prev, siteAddress: e.target.value }))}
                  placeholder="e.g. Kandivali West, Mumbai"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Google Maps Pin Link
                  </label>
                  <input
                    type="url"
                    value={quoteEditForm.googleMapsLink}
                    onChange={(e) => setQuoteEditForm(prev => ({ ...prev, googleMapsLink: e.target.value }))}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Lifecycle Status
                  </label>
                  <select
                    value={quoteEditForm.status}
                    onChange={(e) => setQuoteEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#071827] border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none cursor-pointer"
                  >
                    <option value="Not Contacted">⏳ Not Contacted</option>
                    <option value="Contacted">📞 Contacted</option>
                    <option value="Converted">🏆 Converted</option>
                    <option value="Not Converted">✖ Not Converted</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Scope / Requirement Notes
                </label>
                <textarea
                  rows={2}
                  value={quoteEditForm.message}
                  onChange={(e) => setQuoteEditForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter detailed scope and client notes..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsQuoteEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-water to-[#0d6fa7] hover:from-[#1da3ec] hover:to-brand-water text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  Save Lead Details
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT CONTACT INQUIRY */}
      {/* ========================================================================= */}
      {isContactEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b2138] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-water/20 text-brand-water flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Edit Contact Inquiry
                  </h3>
                  <p className="text-[11px] text-slate-400">Update contact customer info and query</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsContactEditModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveContactEdit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  value={contactEditForm.fullName}
                  onChange={(e) => setContactEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                  placeholder="Customer Name"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={contactEditForm.phone}
                    onChange={(e) => setContactEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactEditForm.email}
                    onChange={(e) => setContactEditForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="customer@email.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Service Requested
                </label>
                <input
                  type="text"
                  value={contactEditForm.serviceRequired}
                  onChange={(e) => setContactEditForm(prev => ({ ...prev, serviceRequired: e.target.value }))}
                  placeholder="e.g. Small Fixes, Flat Works, Building Works"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Customer Message / Requirement
                </label>
                <textarea
                  rows={3}
                  value={contactEditForm.message}
                  onChange={(e) => setContactEditForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter message details or customer notes..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsContactEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-water to-[#0d6fa7] hover:from-[#1da3ec] hover:to-brand-water text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  Save Inquiry
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP MODAL: VIEW ALL QUOTE LEAD DETAILS (TRIGGERED ON CARD CLICK) */}
      {/* ========================================================================= */}
      {viewingQuoteDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b2138] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 my-8">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-white/10 gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-brand-water/20 text-brand-water border border-brand-water/30">
                    Quotation Request
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatLeadDate(viewingQuoteDetail.submittedAt)}</span>
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">
                  {viewingQuoteDetail.fullName || 'Anonymous Customer'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setViewingQuoteDetail(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-3 text-xs text-slate-300">
              
              {/* Status Row with Live Status Selector */}
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Lifecycle Status:</span>
                <select
                  value={viewingQuoteDetail.status || 'Not Contacted'}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    handleUpdateQuoteStatus(viewingQuoteDetail, newStatus);
                    setViewingQuoteDetail(prev => ({ ...prev, status: newStatus }));
                  }}
                  className="px-3 py-1.5 rounded-lg font-bold text-xs bg-[#071827] border border-white/20 text-white focus:outline-none cursor-pointer"
                >
                  <option value="Not Contacted">⏳ Not Contacted</option>
                  <option value="Contacted">📞 Contacted</option>
                  <option value="Converted">🏆 Converted</option>
                  <option value="Not Converted">✖ Not Converted</option>
                </select>
              </div>

              {/* Contact Information */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone / WhatsApp</span>
                  {viewingQuoteDetail.phone && (
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${viewingQuoteDetail.phone}`}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-brand-water" />
                        <span>Call</span>
                      </a>
                      <a
                        href={getWhatsAppHref(viewingQuoteDetail.phone, viewingQuoteDetail.fullName, viewingQuoteDetail.serviceRequired)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <FaWhatsapp className="w-3 h-3 text-[#25D366]" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {viewingQuoteDetail.phone || 'No phone number provided'}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                  {viewingQuoteDetail.email ? (
                    <a
                      href={`mailto:${viewingQuoteDetail.email}`}
                      className="text-brand-water hover:underline font-semibold"
                    >
                      {viewingQuoteDetail.email}
                    </a>
                  ) : (
                    <span className="text-slate-500 italic">Not provided</span>
                  )}
                </div>
              </div>

              {/* Service & Property Type */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Service Required</span>
                  <span className="font-bold text-brand-water text-xs block truncate">
                    🔧 {viewingQuoteDetail.serviceRequired || 'Plumbing Work'}
                  </span>
                </div>

                <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Property Type</span>
                  <span className="font-bold text-slate-200 text-xs block truncate">
                    🏢 {viewingQuoteDetail.projectType || 'Standard Property'}
                  </span>
                </div>
              </div>

              {/* Site Location & Google Maps */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Site Location / Address</span>
                <p className="text-xs text-white leading-relaxed">
                  {viewingQuoteDetail.siteAddress || viewingQuoteDetail.projectLocation || (
                    <span className="text-slate-500 italic">No specific site address entered</span>
                  )}
                </p>

                {viewingQuoteDetail.googleMapsLink && (
                  <div className="pt-1">
                    <a
                      href={viewingQuoteDetail.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-xs font-bold transition-all"
                    >
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>Open Google Maps Pin</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                    </a>
                  </div>
                )}
              </div>

              {/* Scope / Notes */}
              {viewingQuoteDetail.message && (
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Scope / Description</span>
                  <p className="text-xs text-slate-200 italic leading-relaxed whitespace-pre-wrap">
                    "{viewingQuoteDetail.message}"
                  </p>
                </div>
              )}

            </div>

            {/* Footer Modal Actions */}
            <div className="pt-3 flex items-center justify-between gap-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  const lead = viewingQuoteDetail;
                  setViewingQuoteDetail(null);
                  handleDeleteQuote(lead);
                }}
                className="px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold text-red-300 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const lead = viewingQuoteDetail;
                    setViewingQuoteDetail(null);
                    handleOpenEditQuote(lead);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-xs font-bold text-cyan-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingQuoteDetail(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP MODAL: VIEW ALL CONTACT INQUIRY DETAILS (TRIGGERED ON CARD CLICK) */}
      {/* ========================================================================= */}
      {viewingContactDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b2138] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 my-8">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-white/10 gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-brand-water/20 text-brand-water border border-brand-water/30">
                    Contact Inquiry
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatLeadDate(viewingContactDetail.submittedAt)}</span>
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">
                  {viewingContactDetail.fullName || 'Anonymous Customer'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setViewingContactDetail(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-3 text-xs text-slate-300">
              
              {/* Contact Information */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone / WhatsApp</span>
                  {viewingContactDetail.phone && (
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${viewingContactDetail.phone}`}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-brand-water" />
                        <span>Call</span>
                      </a>
                      <a
                        href={getWhatsAppHref(viewingContactDetail.phone, viewingContactDetail.fullName, viewingContactDetail.serviceRequired)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <FaWhatsapp className="w-3 h-3 text-[#25D366]" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {viewingContactDetail.phone || 'No phone number provided'}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                  {viewingContactDetail.email ? (
                    <a
                      href={`mailto:${viewingContactDetail.email}`}
                      className="text-brand-water hover:underline font-semibold"
                    >
                      {viewingContactDetail.email}
                    </a>
                  ) : (
                    <span className="text-slate-500 italic">Not provided</span>
                  )}
                </div>
              </div>

              {/* Service Requested */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Service Requested</span>
                <span className="font-bold text-brand-water text-xs block">
                  🔧 {viewingContactDetail.serviceRequired || 'General Plumbing Consultation'}
                </span>
              </div>

              {/* Customer Message / Requirement */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Customer Message</span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {viewingContactDetail.message ? `"${viewingContactDetail.message}"` : <span className="text-slate-500 italic">No additional message provided (Standard enquiry).</span>}
                </p>
              </div>

            </div>

            {/* Footer Modal Actions */}
            <div className="pt-3 flex items-center justify-between gap-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  const item = viewingContactDetail;
                  setViewingContactDetail(null);
                  handleDeleteContactInquiry(item);
                }}
                className="px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold text-red-300 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const item = viewingContactDetail;
                    setViewingContactDetail(null);
                    handleOpenEditContact(item);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-xs font-bold text-cyan-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingContactDetail(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GLOBAL CONFIRMATION MODAL (CONFIRM BEFORE ANY DELETE / DESTRUCTIVE ACTION) */}
      {/* ========================================================================= */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-[#0b2138] border border-white/15 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 my-8 relative overflow-hidden">
            
            {/* Top Accent Line */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${deleteConfirmModal.isDanger ? 'bg-gradient-to-r from-red-500 via-rose-500 to-amber-500' : 'bg-gradient-to-r from-brand-water via-cyan-400 to-blue-500'}`} />

            <div className="flex items-start gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                deleteConfirmModal.isDanger 
                  ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                  : 'bg-brand-water/20 border-brand-water/30 text-brand-water'
              }`}>
                {deleteConfirmModal.isDanger ? (
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                ) : (
                  <Sparkles className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {deleteConfirmModal.title}
                </h3>
                {deleteConfirmModal.itemName && (
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-white/10 text-slate-200 border border-white/15 truncate max-w-full">
                    {deleteConfirmModal.itemName}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={closeDeleteConfirmModal}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-white/5">
              {deleteConfirmModal.description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-white/10">
              <button
                type="button"
                onClick={closeDeleteConfirmModal}
                disabled={deleteConfirmModal.isProcessing}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof deleteConfirmModal.onConfirm === 'function') {
                    deleteConfirmModal.onConfirm();
                  }
                }}
                disabled={deleteConfirmModal.isProcessing}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center gap-1.5 disabled:opacity-50 ${
                  deleteConfirmModal.isDanger
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-500/20 hover:shadow-red-500/40'
                    : 'bg-gradient-to-r from-brand-water to-[#0d6fa7] hover:from-[#1da3ec] hover:to-brand-water text-white shadow-brand-water/20'
                }`}
              >
                {deleteConfirmModal.isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {deleteConfirmModal.isDanger && <Trash2 className="w-3.5 h-3.5" />}
                    <span>{deleteConfirmModal.confirmButtonText}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* JWT Security Vault & Session Inspector Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-[#0b2138] border border-cyan-500/30 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-inner">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Admin JWT Security Vault</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                      Verified
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Live RFC 7519 cryptographic token status & session watchdog
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSecurityModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Security Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Encryption Algorithm
                </span>
                <span className="font-mono text-cyan-300 font-bold block">
                  {securityInfo?.algorithm || 'RS256 / HS256'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Session Expiry Watchdog
                </span>
                <span className="font-mono text-emerald-300 font-bold block">
                  {timeRemainingFormatted ? `${timeRemainingFormatted} remaining` : 'Active'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Authenticated Admin
                </span>
                <span className="font-mono text-white truncate block" title={currentUser?.email || ''}>
                  {currentUser?.email || 'Administrator'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Inactivity Timeout Guard
                </span>
                <span className="text-slate-200 block">
                  Auto-logout after 30 min idle
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                    Device Session Fingerprint
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">Anti-Hijack Bound</span>
                </div>
                <span className="font-mono text-slate-300 text-[11px] block">
                  {securityInfo?.fingerprint || 'fp_client_verified'}
                </span>
              </div>
            </div>

            {/* Raw JWT Token Display */}
            {jwtToken && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Active Signed JWT Token (Bearer)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyJwt}
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{tokenCopied ? 'Copied!' : 'Copy Token'}</span>
                  </button>
                </div>
                <p className="font-mono text-[10px] text-slate-400 break-all line-clamp-3 bg-white/5 p-2 rounded-lg">
                  {jwtToken}
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleRotateJwtToken}
                disabled={isRefreshingToken}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-xs font-bold text-cyan-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingToken ? 'animate-spin' : ''}`} />
                <span>{isRefreshingToken ? 'Rotating Token...' : 'Rotate / Refresh JWT Token'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold text-red-300 hover:text-red-200 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
                <button
                  type="button"
                  onClick={() => setShowSecurityModal(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

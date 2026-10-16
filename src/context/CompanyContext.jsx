import React, { createContext, useContext, useState, useEffect } from 'react';
import { companyInfo as initialCompanyInfo } from '../data/companyInfo';
import { subscribeToDocument, setDocumentSafely } from '../firebase/firestore';

const CompanyContext = createContext({
  company: initialCompanyInfo,
  updateCompanyDetails: async () => {},
  loading: false,
});

export function CompanyProvider({ children }) {
  const [company, setCompany] = useState(() => {
    const saved = localStorage.getItem('jbc_settings_companyInfo');
    if (saved) {
      try {
        return { ...initialCompanyInfo, ...JSON.parse(saved) };
      } catch {
        return initialCompanyInfo;
      }
    }
    return initialCompanyInfo;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for company settings from Firestore 'settings/companyInfo'
    const unsubscribe = subscribeToDocument('settings', 'companyInfo', (liveData) => {
      if (liveData) {
        setCompany(prev => ({
          ...prev,
          ...liveData,
          phoneHref: `tel:${(liveData.phone || prev.phone).replace(/\s+/g, '')}`,
          whatsappHref: `https://wa.me/${(liveData.whatsapp || prev.whatsapp).replace(/[^0-9]/g, '')}?text=Hello%20Jai%20Bhavani%20Constructions,%20I%20have%20a%20plumbing%20requirement%20in%20Mumbai.`,
          emailHref: `mailto:${liveData.email || prev.email}`,
          workingHours: {
            ...prev.workingHours,
            ...(liveData.workingHours || {})
          },
          socialLinks: liveData.socialLinks || prev.socialLinks
        }));
      }
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const updateCompanyDetails = async (newDetails) => {
    try {
      const merged = {
        ...company,
        ...newDetails,
        phoneDisplay: newDetails.phone || company.phoneDisplay,
        whatsappDisplay: newDetails.whatsapp || company.whatsappDisplay,
        phoneHref: `tel:${(newDetails.phone || company.phone).replace(/\s+/g, '')}`,
        whatsappHref: `https://wa.me/${(newDetails.whatsapp || company.whatsapp).replace(/[^0-9]/g, '')}?text=Hello%20Jai%20Bhavani%20Constructions,%20I%20have%20a%20plumbing%20requirement%20in%20Mumbai.`,
        emailHref: `mailto:${newDetails.email || company.email}`,
      };

      setCompany(merged);
      localStorage.setItem('jbc_settings_companyInfo', JSON.stringify(merged));
      const res = await setDocumentSafely('settings', 'companyInfo', merged);
      return res;
    } catch (err) {
      console.warn('Cloud sync for company info skipped, local update preserved:', err);
      return { success: true, isLocal: true };
    }
  };

  return (
    <CompanyContext.Provider value={{ company, updateCompanyDetails, loading }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanyInfo() {
  return useContext(CompanyContext);
}

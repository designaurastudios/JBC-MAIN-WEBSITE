import { companyInfo } from '../data/companyInfo';

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Plumber", "GeneralContractor", "LocalBusiness"],
    "name": companyInfo.name,
    "alternateName": companyInfo.alternateNames,
    "description": companyInfo.primaryService,
    "url": "https://jaibhavaniconstructions.com",
    "logo": "https://jaibhavaniconstructions.com/jbc-logo.png",
    "image": "https://jaibhavaniconstructions.com/images/hero-plumbing.jpg",
    "telephone": companyInfo.phone,
    "email": companyInfo.email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": companyInfo.serviceCity,
      "addressRegion": companyInfo.serviceState,
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "19.0760",
      "longitude": "72.8777"
    },
    "priceRange": "$$",
    "areaServed": [
      {
        "@type": "City",
        "name": "Mumbai"
      },
      {
        "@type": "City",
        "name": "Navi Mumbai"
      },
      {
        "@type": "City",
        "name": "Thane"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Maharashtra"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Plumbing & Construction Contracting Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Commercial & Residential Plumbing Contractor",
            "description": "Turnkey plumbing installations, piping infrastructure, drainage, and repair services."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Construction & Pipeline Infrastructure",
            "description": "High-rise riser shafts, booster pump manifolds, and multi-tier water distribution."
          }
        }
      ]
    },
    "knowsAbout": [
      "Jai Bhavani Constructions",
      "Jay Bhavani Construction",
      "Plumbing Contractor Mumbai",
      "Plumbing Contractor",
      "Residential Plumbing Services",
      "Commercial Plumbing Infrastructure",
      "Construction Plumbing Contractor",
      "Pipeline Installation",
      "Leak Diagnostics & Non-Destructive Repair",
      "Drainage & Sewage Solutions",
      "Water Supply Booster Manifolds"
    ]
  };
}

export function getBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://jaibhavaniconstructions.com${item.href}`
    }))
  };
}

export function getFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

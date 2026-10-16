import React from 'react';
import { Helmet } from 'react-helmet-async';
import { companyInfo } from '../data/companyInfo';
import { getOrganizationSchema } from './schemas';

export function SEO({ 
  title, 
  description, 
  canonicalPath = '', 
  ogImage = '/jbc-logo.png',
  schemaJson = null 
}) {
  const siteUrl = 'https://jaibhavaniconstructions.com';
  const fullUrl = `${siteUrl}${canonicalPath}`;
  const pageTitle = title 
    ? `${title} | ${companyInfo.name}`
    : `${companyInfo.name} | Professional Plumbing Solutions`;
  
  const metaDescription = description || companyInfo.primaryService;
  const defaultOrgSchema = getOrganizationSchema();

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content={companyInfo.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(defaultOrgSchema)}
      </script>

      {schemaJson && (
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      )}
    </Helmet>
  );
}

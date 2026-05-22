import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../config/siteConfig';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export default function SEO({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website' 
}: SEOProps) {
  const siteName = siteConfig.siteId === 'siteE' ? 'House of Hibba' : siteConfig.siteId;
  const fullTitle = title 
    ? `${title} | ${siteName}` 
    : `${siteName} — Elegant Modest Fashion for the Classy Woman`;
  
  const metaDescription = description || "We create premium modest outfits that inspire confidence, beauty, and sophistication.";
  const metaImage = image || "https://i.imgur.com/4A4gEqV.jpeg";
  const canonicalUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
}

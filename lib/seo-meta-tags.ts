// SEO Meta Tags and Content Marketing for Clinic & Pharmacy Management SaaS

export interface MetaTagsConfig {
  title: string
  description: string
  keywords: string[]
  openGraph: {
    title: string
    description: string
    type: string
    url: string
    image: string
    siteName: string
    locale: string
    alternateLocale: string[]
  }
  twitter: {
    card: string
    title: string
    description: string
    image: string
    site?: string
    creator?: string
  }
  structuredData: any
}

// =============================================================================
// PRIMARY META TAGS FOR LANDING PAGE
// =============================================================================

export const landingPageMeta: MetaTagsConfig = {
  // Title: 50-60 characters optimal for Google
  title: "ক্লিনিক ও ফার্মেসি ম্যানেজমেন্ট সফটওয়্যার | Clinic & Pharmacy Management Software | ১৪ দিন ফ্রি ট্রায়াল",
  
  // Description: 150-160 characters for optimal display
  description: "বাংলাদেশের #১ ক্লিনিক ও ফার্মেসি ম্যানেজমেন্ট সিস্টেম। রোগী ব্যবস্থাপনা, অ্যাপয়েন্টমেন্ট, প্রেসক্রিপশন ও স্টক ম্যানেজমেন্ট। ১ৄ দিন ফ্রি ট্রায়াল।",
  
  keywords: [
    // Bengali Keywords
    "ক্লিনিক ম্যানেজমেন্ট সফটওয়্যার",
    "ফার্মেসি ম্যানেজমেন্ট সিস্টেম",
    "হাসপাতাল ম্যানেজমেন্ট",
    "রোগী ব্যবস্থাপনা",
    "প্রেসক্রিপশন সফটওয়্যার",
    "অ্যাপয়েন্টমেন্ট বুকিং",
    "ওষুধের স্টক ম্যানেজমেন্ট",
    "চিকিৎসা সফটওয়্যার বাংলাদেশ",
    
    // English Keywords
    "clinic management software",
    "pharmacy management system",
    "hospital management software",
    "patient management system",
    "appointment booking system",
    "prescription software",
    "medical practice management",
    "healthcare software Bangladesh",
    "EMR software",
    "clinic software",
    "pharmacy POS system",
    "medical billing software"
  ],

  openGraph: {
    title: "ক্লিনিক ও ফার্মেসি ম্যানেজমেন্ট সফটওয়্যার | Clinic Management System",
    description: "বাংলাদেশের সর্বোত্তম ক্লিনিক ও ফার্মেসি ম্যানেজমেন্ট সিস্টেম। SMS রিমাইন্ডার, অনলাইন বুকিং, ডিজিটাল প্রেসক্রিপশন সহ সম্পূর্ণ সমাধান।",
    type: "website",
    url: "https://clinicms.com",
    image: "https://clinicms.com/images/og-image.jpg",
    siteName: "Clinic Management System",
    locale: "bn_BD",
    alternateLocale: ["en_US", "bn_BD"]
  },

  twitter: {
    card: "summary_large_image",
    title: "ক্লিনিক ও ফার্মেসি ম্যানেজমেন্ট সফটওয়্যার",
    description: "বাংলাদেশের #১ ক���লিনিক ম্যানেজমেন্ট সিস্টেম। ১৪ দিন ফ্রি ট্রায়াল শুরু করুন।",
    image: "https://clinicms.com/images/twitter-card.jpg",
    site: "@clinicms",
    creator: "@clinicms"
  },

  structuredData: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Clinic & Pharmacy Management System",
    "alternateName": "ক্লিনিক ও ফার্মেসি ম্যানেজমেন্ট সিস্টেম",
    "description": "Complete clinic and pharmacy management software for healthcare providers in Bangladesh",
    "url": "https://clinicms.com",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "2500",
      "priceCurrency": "BDT",
      "priceValidUntil": "2024-12-31",
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Organization",
      "name": "Clinic Management System",
      "url": "https://clinicms.com"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    }
  }
}

// =============================================================================
// ALTERNATIVE META TAG VARIATIONS
// =============================================================================

export const metaVariations = {
  // For different target audiences
  doctors: {
    title: "ডাক্তারদের জন্য ক্লিনিক ম্যানেজমেন্ট সফটওয়্যার | Doctor Clinic Software | ফ্রি ট্রায়াল",
    description: "ডাক্তারদের জন্য বিশেষভাবে ডিজাইন করা ক্লিনিক ম্যানেজমেন্ট সিস্টেম। রোগীর রেকর্ড, প্রেসক্রিপশন ও অ্যাপয়েন্টমেন্ট ব্যবস্থাপনা সহজ করুন।"
  },
  
  pharmacies: {
    title: "ফার্মেসি ম্যানেজমেন্ট সফটওয়্যার | Pharmacy POS System | ইনভেন্টরি ট্র্যাকিং",
    description: "আধুনিক ফার্মেসি ম্যানেজমেন্ট সিস্টেম। POS, ইনভেন্টরি ট্র্যাকিং, এক্সপায়ার��� ডেট মনিটরিং ও বিক্রয় রিপোর্ট। ১৪ দিন ফ্রি।"
  },
  
  smallClinics: {
    title: "ছোট ক্লিনিকের জন্য সাশ্রয়ী ম্যানেজমেন্ট সফটওয়্যার | Small Clinic Software",
    description: "ছোট ও মাঝারি ক্লিনিকের জন্য সাশ্রয়ী মূল্যে সম্পূর্ণ ম্যানেজমেন্ট সমাধান। মাসিক ২৫০০ টাকা থেকে শুরু। ফ্রি ট্রায়াল এখনই।"
  }
}

// =============================================================================
// BLOG POST TITLES FOR CONTENT MARKETING
// =============================================================================

export const blogPostTitles = [
  // 1. How-to Guide (Bengali/English)
  {
    bengali: "কিভাবে আপনার ক্লিনিকে ডিজিটাল রোগী ব্যবস্থাপনা চালু করবেন: সম্পূর্ণ গাইড",
    english: "How to Implement Digital Patient Management in Your Clinic: Complete Guide for Bangladeshi Healthcare Providers",
    category: "Tutorial",
    keywords: ["patient management", "digital healthcare", "clinic software"],
    estimatedReadTime: "8 minutes"
  },

  // 2. Benefits/Features Focus
  {
    bengali: "ফার্মেসি ইনভেন্টরি ম্যানেজমেন্ট: কেন স্বয়ংক্রিয় সিস্টেম আপনার লাভ বাড়াবে",
    english: "Pharmacy Inventory Management: Why Automated Systems Increase Your Profit Margins",
    category: "Business Benefits",
    keywords: ["pharmacy inventory", "profit optimization", "automated systems"],
    estimatedReadTime: "6 minutes"
  },

  // 3. Problem-Solution
  {
    bengali: "বাংলাদেশের স্বাস্থ্যসেবায় ডিজিটাল রূপান্তর: চ্যালেঞ্জ ও সমাধান",
    english: "Digital Transformation in Bangladesh Healthcare: Challenges and Solutions for Modern Clinics",
    category: "Industry Insights",
    keywords: ["digital transformation", "healthcare Bangladesh", "medical technology"],
    estimatedReadTime: "10 minutes"
  },

  // 4. Comparison/Review
  {
    bengali: "ক্লিনিক ম্যানেজমেন্ট সফটওয়্যার নি���্বাচনের আগে যে ১০টি বিষয় ভাবতে হবে",
    english: "10 Essential Features to Look for When Choosing Clinic Management Software in 2024",
    category: "Buyer's Guide",
    keywords: ["software selection", "clinic management features", "healthcare technology"],
    estimatedReadTime: "7 minutes"
  },

  // 5. Success Story/Case Study
  {
    bengali: "কেস স্টাডি: কিভাবে ঢাকার একটি ছোট ক্লিনিক ৩ মাসে রোগী সংখ্যা ৫০% বাড়াল",
    english: "Case Study: How a Small Dhaka Clinic Increased Patient Volume by 50% in 3 Months",
    category: "Success Story",
    keywords: ["case study", "patient growth", "clinic success"],
    estimatedReadTime: "5 minutes"
  }
]

// =============================================================================
// SEO-OPTIMIZED CONTENT SNIPPETS
// =============================================================================

export const contentSnippets = {
  // Hero section description
  heroDescription: "বাংলাদেশের #১ ক্লিনিক ও ফার্মেসি ম্যানেজমেন্ট সিস্টেম যা আপনার স্বাস্থ্যসেবা প্রতিষ্ঠানকে ডিজিটাল যুগে এগিয়ে নিয়ে যাবে। রোগীর তথ্য ব্যবস্থাপনা থেকে শুরু করে অ্যাপয়েন্টমেন্ট শিডিউলিং, প্রেসক্রিপশন লেখা এবং ফার্মেসি ইনভেন্টরি ট্র্যাকিং - সবকিছু এক প্ল্যাটফর্মে।",

  // Features benefits
  featuresIntro: "আধুনিক প্রযুক্তির সাথে ঐতিহ্যবাহী চিকিৎসাসেবার সমন্বয়ে তৈরি আমাদের সম্পূর্ণ সমাধান:",

  // Call to action
  primaryCTA: "১৪ দিনের সম্পূর্ণ ফ্রি ট্রায়াল শুরু করুন - কোন ক্রেডিট কার্ড লাগবে না",
  secondaryCTA: "বিনামূল্যে ডেমো দেখুন এবং বুঝে নিন কিভাবে এটি আপনার ক্লিনিকের কাজ সহজ করবে"
}

// =============================================================================
// UTILITY FUNCTIONS FOR SEO
// =============================================================================

export const generateMetaTags = (config: MetaTagsConfig) => {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),
    openGraph: config.openGraph,
    twitter: config.twitter,
    structuredData: JSON.stringify(config.structuredData)
  }
}

export const getLocalizedTitle = (baseTitle: string, locale: 'bn' | 'en') => {
  if (locale === 'bn') {
    return baseTitle
  }
  // Convert to English version
  return baseTitle.replace(/ক্লিনিক ও ফার্মেসি ম্যানেজমেন্ট সফটওয়্যার/g, 'Clinic & Pharmacy Management Software')
                  .replace(/ফ্রি ট্রায়াল/g, 'Free Trial')
}

// Page-specific meta configurations
export const pageMetaConfigs = {
  home: landingPageMeta,
  pricing: {
    ...landingPageMeta,
    title: "সাশ্রয়ী মূল্যে ক্লিনিক ম্যানেজমেন্ট সফটওয়্যার | Pricing | ২৫০০ টাকা থেকে শুরু",
    description: "স্বচ্ছ ও সাশ্রয়ী মূল্যে ক্লিনি�� ম্যানেজমেন্ট সফটওয়্যার। বেসিক প্ল্যান ২৫০০ টাকা/মাস থেকে। ১৪ দিন ফ্রি ট্রায়াল। কোন সেটআপ ফি নেই।"
  },
  features: {
    ...landingPageMeta,
    title: "ক্লিনিক ম্যানেজমেন্ট সফটওয়্যারের ফিচার | Features | সম্পূর্ণ তালিকা",
    description: "রোগী ব্যবস্থাপনা, অ্যাপয়েন্টমেন্ট বুকিং, প্রেসক্রিপশন, ফার্মেসি POS, SMS রিমাইন্ডার, রিপোর্ট ও আরও অনেক কিছু। বিস্তারিত ফিচার তালিকা দেখুন।"
  },
  contact: {
    ...landingPageMeta,
    title: "যোগাযোগ করুন | Contact Us | ক্লিনিক ম্যানেজমেন্ট সফটওয়্যার সাপোর্ট",
    description: "আমাদের সাথে যোগাযোগ করুন। ২৪/৭ সাপোর্ট, ফ্রি কনসালটেশন ও ডেমো। ফোন: ০১৭০০-০০০০০০। ইমেইল: support@clinicms.com"
  }
}

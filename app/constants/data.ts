// PixelPost Social Data Constants
import { COLORS, IMAGES } from './theme';

/* =====================================================
   SUBSCRIPTION PLANS (RECURRING)
   ===================================================== */

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    priceUSD: 0,
    priceKES: 0,
    currency: 'USD',
    period: 'forever',
    purchasable: true,
    features: [
      '5 posts per month',
      '2 social accounts',
      'Basic scheduling',
      'Standard support',
    ],
    limitations: [
      'No analytics',
      'No team features',
      'Limited media storage',
    ],
    recommended: false,
  },

  {
    id: 'pro_monthly',
    name: 'Pro',
    priceUSD: 9.99,
    priceKES: 1500,
    currency: 'USD',
    period: 'month',
    purchasable: false, // 🚧 disabled for launch
    features: [
      'Unlimited posts',
      '10 social accounts',
      'Advanced scheduling',
      'Full analytics',
      'Priority support',
      'Custom hashtag suggestions',
      'Post templates',
    ],
    limitations: [],
    recommended: true,
  },

  {
    id: 'pro_annual',
    name: 'Pro Annual',
    priceUSD: 99.99,
    priceKES: 15000,
    currency: 'USD',
    period: 'year',
    purchasable: false, // 🚧 disabled for launch
    features: [
      'All Pro features',
      '2 months free',
      'Early access to new features',
    ],
    limitations: [],
    recommended: false,
  },

  {
    id: 'business',
    name: 'Business',
    priceUSD: 29.99,
    priceKES: 4500,
    currency: 'USD',
    period: 'month',
    purchasable: false, // 🚧 disabled for launch
    features: [
      'Everything in Pro',
      'Unlimited social accounts',
      'Team collaboration (5 members)',
      'API access',
      'White-label reports',
      'Dedicated account manager',
      'Custom integrations',
    ],
    limitations: [],
    recommended: false,
  },
];

/* =====================================================
   CREDIT PACKAGES (PAY-AS-YOU-GO) — LIVE AT LAUNCH
   ===================================================== */

export const CREDIT_PACKAGES = [
  {
    id: 'credits_10',
    name: 'Starter',
    credits: 10,
    priceUSD: 1,
    priceKES: 125,
    description: 'Perfect for trying PixelPost',
    recommended: true,
  },
  {
    id: 'credits_25',
    name: 'Creator',
    credits: 25,
    priceUSD: 3,
    priceKES: 375,
    description: 'For active creators',
    recommended: false,
  },
  {
    id: 'credits_50',
    name: 'Growth',
    credits: 50,
    priceUSD: 6,
    priceKES: 750,
    description: 'Best value for teams',
    recommended: false,
  },
  {
    id: 'credits_100',
    name: 'Power',
    credits: 100,
    priceUSD: 10,
    priceKES: 1250,
    description: 'High-volume publishing',
    recommended: false,
  },
];

/* =====================================================
   SOCIAL MEDIA PLATFORMS
   ===================================================== */

export const SOCIAL_PLATFORMS = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'logo-instagram',
    color: COLORS.instagram,
    supported: true,
    features: ['photos', 'videos', 'stories', 'reels'],
    maxCaptionLength: 2200,
    maxHashtags: 30,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'logo-facebook',
    color: COLORS.facebook,
    supported: true,
    features: ['photos', 'videos', 'stories', 'links'],
    maxCaptionLength: 63206,
    maxHashtags: 30,
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: 'logo-twitter',
    color: COLORS.twitter,
    supported: true,
    features: ['photos', 'videos', 'threads'],
    maxCaptionLength: 280,
    maxHashtags: 10,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'logo-linkedin',
    color: COLORS.linkedin,
    supported: true,
    features: ['photos', 'videos', 'articles'],
    maxCaptionLength: 3000,
    maxHashtags: 5,
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: 'logo-pinterest',
    color: COLORS.pinterest,
    supported: true,
    features: ['photos', 'pins'],
    maxCaptionLength: 500,
    maxHashtags: 20,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'musical-notes',
    color: COLORS.tiktok,
    supported: false,
    features: ['videos'],
    maxCaptionLength: 2200,
    maxHashtags: 100,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'logo-youtube',
    color: COLORS.youtube,
    supported: false,
    features: ['videos', 'shorts'],
    maxCaptionLength: 5000,
    maxHashtags: 15,
  },
];

/* =====================================================
   SAMPLE POSTS
   ===================================================== */

export const SAMPLE_POSTS = [
  {
    id: '1',
    image: IMAGES.samplePosts[0],
    caption: 'Beautiful sunset over the mountains! #nature #photography #sunset',
    platforms: ['instagram', 'facebook'],
    scheduledAt: new Date(Date.now() + 3600000).toISOString(),
    status: 'scheduled',
    likes: 0,
    comments: 0,
    shares: 0,
  },
  {
    id: '2',
    image: IMAGES.samplePosts[1],
    caption: 'New product launch coming soon! #business #launch',
    platforms: ['twitter', 'linkedin'],
    scheduledAt: new Date(Date.now() + 7200000).toISOString(),
    status: 'scheduled',
    likes: 0,
    comments: 0,
    shares: 0,
  },
];

/* =====================================================
   ANALYTICS
   ===================================================== */

export const ANALYTICS_DATA = {
  overview: {
    totalPosts: 156,
    totalEngagement: 12450,
    totalReach: 89200,
    growthRate: 12.5,
  },
};

/* =====================================================
   HASHTAGS
   ===================================================== */

export const HASHTAG_SUGGESTIONS = {
  photography: ['#photography', '#photooftheday', '#instagood'],
  business: ['#business', '#entrepreneur', '#success'],
  lifestyle: ['#lifestyle', '#life', '#love'],
};

/* =====================================================
   NOTIFICATIONS
   ===================================================== */

export const NOTIFICATION_TYPES = {
  POST_SUCCESS: 'post_success',
  POST_FAILED: 'post_failed',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
};

export const SAMPLE_NOTIFICATIONS = [
  {
    id: '1',
    type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
    title: 'Payment Successful',
    message: 'Your credits have been added to your account.',
    timestamp: new Date().toISOString(),
    read: false,
  },
];

export default {
  SUBSCRIPTION_PLANS,
  CREDIT_PACKAGES,
  SOCIAL_PLATFORMS,
  SAMPLE_POSTS,
  ANALYTICS_DATA,
  HASHTAG_SUGGESTIONS,
  NOTIFICATION_TYPES,
  SAMPLE_NOTIFICATIONS,
};

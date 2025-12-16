// PixelPost Social Data Constants
import { COLORS, IMAGES } from './theme';

// Subscription Plans
export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    period: 'forever',
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
    price: 9.99,
    priceNGN: 15000,
    currency: 'USD',
    period: 'month',
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
    price: 99.99,
    priceNGN: 150000,
    currency: 'USD',
    period: 'year',
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
    price: 29.99,
    priceNGN: 45000,
    currency: 'USD',
    period: 'month',
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

// Credit Packages for Pay-Per-Use
export const CREDIT_PACKAGES = [
  { id: 'credits_10', credits: 10, price: 2.99, priceNGN: 4500 },
  { id: 'credits_25', credits: 25, price: 5.99, priceNGN: 9000 },
  { id: 'credits_50', credits: 50, price: 9.99, priceNGN: 15000 },
  { id: 'credits_100', credits: 100, price: 17.99, priceNGN: 27000 },
];

// Social Media Platforms
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

// Sample Posts Data
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
    caption: 'New product launch coming soon! Stay tuned. #business #launch',
    platforms: ['twitter', 'linkedin'],
    scheduledAt: new Date(Date.now() + 7200000).toISOString(),
    status: 'scheduled',
    likes: 0,
    comments: 0,
    shares: 0,
  },
  {
    id: '3',
    image: IMAGES.samplePosts[2],
    caption: 'Behind the scenes of our latest project #creative #work',
    platforms: ['instagram'],
    scheduledAt: null,
    status: 'draft',
    likes: 0,
    comments: 0,
    shares: 0,
  },
  {
    id: '4',
    image: IMAGES.samplePosts[3],
    caption: 'Monday motivation! Start your week strong. #motivation #monday',
    platforms: ['facebook', 'twitter', 'linkedin'],
    scheduledAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'published',
    likes: 245,
    comments: 32,
    shares: 18,
  },
  {
    id: '5',
    image: IMAGES.samplePosts[4],
    caption: 'Check out our latest blog post! Link in bio. #blog #content',
    platforms: ['instagram', 'pinterest'],
    scheduledAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'published',
    likes: 189,
    comments: 15,
    shares: 8,
  },
  {
    id: '6',
    image: IMAGES.samplePosts[5],
    caption: 'Team building day! Great vibes with amazing people. #team #culture',
    platforms: ['linkedin', 'facebook'],
    scheduledAt: new Date(Date.now() - 259200000).toISOString(),
    status: 'published',
    likes: 412,
    comments: 56,
    shares: 24,
  },
];

// Analytics Data
export const ANALYTICS_DATA = {
  overview: {
    totalPosts: 156,
    totalEngagement: 12450,
    totalReach: 89200,
    growthRate: 12.5,
  },
  weeklyStats: [
    { day: 'Mon', posts: 5, engagement: 320 },
    { day: 'Tue', posts: 8, engagement: 450 },
    { day: 'Wed', posts: 6, engagement: 380 },
    { day: 'Thu', posts: 10, engagement: 620 },
    { day: 'Fri', posts: 12, engagement: 890 },
    { day: 'Sat', posts: 4, engagement: 280 },
    { day: 'Sun', posts: 3, engagement: 210 },
  ],
  platformStats: [
    { platform: 'Instagram', followers: 15420, engagement: 4.2, posts: 45 },
    { platform: 'Facebook', followers: 8930, engagement: 2.8, posts: 38 },
    { platform: 'Twitter', followers: 5670, engagement: 3.1, posts: 52 },
    { platform: 'LinkedIn', followers: 3240, engagement: 5.6, posts: 21 },
  ],
  bestTimes: [
    { day: 'Monday', time: '9:00 AM', engagement: 'High' },
    { day: 'Tuesday', time: '12:00 PM', engagement: 'Very High' },
    { day: 'Wednesday', time: '3:00 PM', engagement: 'High' },
    { day: 'Thursday', time: '6:00 PM', engagement: 'Very High' },
    { day: 'Friday', time: '10:00 AM', engagement: 'High' },
  ],
};

// Hashtag Suggestions
export const HASHTAG_SUGGESTIONS = {
  photography: ['#photography', '#photooftheday', '#instagood', '#picoftheday', '#photo', '#beautiful', '#art', '#nature'],
  business: ['#business', '#entrepreneur', '#success', '#motivation', '#marketing', '#startup', '#smallbusiness', '#growth'],
  lifestyle: ['#lifestyle', '#life', '#love', '#happy', '#style', '#fashion', '#beauty', '#health'],
  travel: ['#travel', '#wanderlust', '#adventure', '#explore', '#vacation', '#travelgram', '#trip', '#tourism'],
  food: ['#food', '#foodie', '#foodporn', '#yummy', '#delicious', '#cooking', '#recipe', '#homemade'],
  fitness: ['#fitness', '#gym', '#workout', '#fit', '#health', '#training', '#exercise', '#motivation'],
};

// Notification Types
export const NOTIFICATION_TYPES = {
  POST_SUCCESS: 'post_success',
  POST_FAILED: 'post_failed',
  SCHEDULE_REMINDER: 'schedule_reminder',
  ENGAGEMENT_ALERT: 'engagement_alert',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  SUBSCRIPTION_RENEWAL: 'subscription_renewal',
  NEW_FEATURE: 'new_feature',
};

// Sample Notifications
export const SAMPLE_NOTIFICATIONS = [
  {
    id: '1',
    type: NOTIFICATION_TYPES.POST_SUCCESS,
    title: 'Post Published Successfully',
    message: 'Your post has been published to Instagram and Facebook.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: '2',
    type: NOTIFICATION_TYPES.ENGAGEMENT_ALERT,
    title: 'High Engagement Alert',
    message: 'Your recent post is getting 50% more engagement than usual!',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
  },
  {
    id: '3',
    type: NOTIFICATION_TYPES.SCHEDULE_REMINDER,
    title: 'Scheduled Post Reminder',
    message: 'You have a post scheduled for 3:00 PM today.',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    read: true,
  },
  {
    id: '4',
    type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
    title: 'Payment Successful',
    message: 'Your Pro subscription has been renewed successfully.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
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

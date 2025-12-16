/**
 * Social Media API Service
 * Handles posting content to connected social media platforms
 */

import { getValidAccessToken } from './oauth/OAuthService';
import { OAuthPlatform } from './oauth/config';

// API endpoints for posting
const POST_ENDPOINTS = {
  instagram: {
    // Instagram requires a two-step process: create container, then publish
    createMedia: 'https://graph.instagram.com/me/media',
    publishMedia: 'https://graph.instagram.com/me/media_publish',
  },
  facebook: {
    // Facebook Page posting
    pagePost: (pageId: string) => `https://graph.facebook.com/v18.0/${pageId}/feed`,
    pagePhoto: (pageId: string) => `https://graph.facebook.com/v18.0/${pageId}/photos`,
  },
  twitter: {
    tweet: 'https://api.twitter.com/2/tweets',
    mediaUpload: 'https://upload.twitter.com/1.1/media/upload.json',
  },
  linkedin: {
    ugcPost: 'https://api.linkedin.com/v2/ugcPosts',
    shares: 'https://api.linkedin.com/v2/shares',
  },
  pinterest: {
    pins: 'https://api.pinterest.com/v5/pins',
  },
};

export interface PostContent {
  caption: string;
  imageUrl?: string;
  videoUrl?: string;
  link?: string;
  hashtags?: string[];
}

export interface PostResult {
  success: boolean;
  postId?: string;
  error?: string;
  platform: string;
}

/**
 * Post to Instagram
 */
async function postToInstagram(content: PostContent): Promise<PostResult> {
  try {
    const accessToken = await getValidAccessToken('instagram');
    if (!accessToken) {
      return { success: false, error: 'Not authenticated', platform: 'instagram' };
    }

    // Step 1: Create media container
    const createParams = new URLSearchParams({
      access_token: accessToken,
      caption: content.caption,
    });

    if (content.imageUrl) {
      createParams.append('image_url', content.imageUrl);
    } else if (content.videoUrl) {
      createParams.append('video_url', content.videoUrl);
      createParams.append('media_type', 'VIDEO');
    }

    const createResponse = await fetch(
      `${POST_ENDPOINTS.instagram.createMedia}?${createParams.toString()}`,
      { method: 'POST' }
    );

    if (!createResponse.ok) {
      const error = await createResponse.json();
      return { success: false, error: error.error?.message || 'Failed to create media', platform: 'instagram' };
    }

    const createData = await createResponse.json();
    const containerId = createData.id;

    // Step 2: Publish the container
    const publishParams = new URLSearchParams({
      access_token: accessToken,
      creation_id: containerId,
    });

    const publishResponse = await fetch(
      `${POST_ENDPOINTS.instagram.publishMedia}?${publishParams.toString()}`,
      { method: 'POST' }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json();
      return { success: false, error: error.error?.message || 'Failed to publish', platform: 'instagram' };
    }

    const publishData = await publishResponse.json();
    return { success: true, postId: publishData.id, platform: 'instagram' };
  } catch (error) {
    console.error('Instagram post error:', error);
    return { success: false, error: 'Failed to post to Instagram', platform: 'instagram' };
  }
}

/**
 * Post to Facebook Page
 */
async function postToFacebook(content: PostContent, pageId: string): Promise<PostResult> {
  try {
    const accessToken = await getValidAccessToken('facebook');
    if (!accessToken) {
      return { success: false, error: 'Not authenticated', platform: 'facebook' };
    }

    const endpoint = content.imageUrl
      ? POST_ENDPOINTS.facebook.pagePhoto(pageId)
      : POST_ENDPOINTS.facebook.pagePost(pageId);

    const body: Record<string, string> = {
      access_token: accessToken,
      message: content.caption,
    };

    if (content.imageUrl) {
      body.url = content.imageUrl;
    }

    if (content.link) {
      body.link = content.link;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'Failed to post', platform: 'facebook' };
    }

    const data = await response.json();
    return { success: true, postId: data.id || data.post_id, platform: 'facebook' };
  } catch (error) {
    console.error('Facebook post error:', error);
    return { success: false, error: 'Failed to post to Facebook', platform: 'facebook' };
  }
}

/**
 * Post to Twitter/X
 */
async function postToTwitter(content: PostContent): Promise<PostResult> {
  try {
    const accessToken = await getValidAccessToken('twitter');
    if (!accessToken) {
      return { success: false, error: 'Not authenticated', platform: 'twitter' };
    }

    // Build tweet text with hashtags
    let tweetText = content.caption;
    if (content.hashtags && content.hashtags.length > 0) {
      tweetText += '\n\n' + content.hashtags.join(' ');
    }

    // Truncate if needed (280 char limit)
    if (tweetText.length > 280) {
      tweetText = tweetText.substring(0, 277) + '...';
    }

    const response = await fetch(POST_ENDPOINTS.twitter.tweet, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: tweetText }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.detail || 'Failed to tweet', platform: 'twitter' };
    }

    const data = await response.json();
    return { success: true, postId: data.data?.id, platform: 'twitter' };
  } catch (error) {
    console.error('Twitter post error:', error);
    return { success: false, error: 'Failed to post to Twitter', platform: 'twitter' };
  }
}

/**
 * Post to LinkedIn
 */
async function postToLinkedIn(content: PostContent, personUrn: string): Promise<PostResult> {
  try {
    const accessToken = await getValidAccessToken('linkedin');
    if (!accessToken) {
      return { success: false, error: 'Not authenticated', platform: 'linkedin' };
    }

    const postBody = {
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content.caption,
          },
          shareMediaCategory: content.imageUrl ? 'IMAGE' : 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const response = await fetch(POST_ENDPOINTS.linkedin.ugcPost, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postBody),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to post', platform: 'linkedin' };
    }

    const data = await response.json();
    return { success: true, postId: data.id, platform: 'linkedin' };
  } catch (error) {
    console.error('LinkedIn post error:', error);
    return { success: false, error: 'Failed to post to LinkedIn', platform: 'linkedin' };
  }
}

/**
 * Post to Pinterest
 */
async function postToPinterest(content: PostContent, boardId: string): Promise<PostResult> {
  try {
    const accessToken = await getValidAccessToken('pinterest');
    if (!accessToken) {
      return { success: false, error: 'Not authenticated', platform: 'pinterest' };
    }

    if (!content.imageUrl) {
      return { success: false, error: 'Pinterest requires an image', platform: 'pinterest' };
    }

    const pinBody = {
      board_id: boardId,
      media_source: {
        source_type: 'image_url',
        url: content.imageUrl,
      },
      description: content.caption,
      link: content.link,
    };

    const response = await fetch(POST_ENDPOINTS.pinterest.pins, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pinBody),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to create pin', platform: 'pinterest' };
    }

    const data = await response.json();
    return { success: true, postId: data.id, platform: 'pinterest' };
  } catch (error) {
    console.error('Pinterest post error:', error);
    return { success: false, error: 'Failed to post to Pinterest', platform: 'pinterest' };
  }
}

/**
 * Post to multiple platforms
 */
export async function postToMultiplePlatforms(
  platforms: OAuthPlatform[],
  content: PostContent,
  platformConfig?: {
    facebookPageId?: string;
    linkedInPersonUrn?: string;
    pinterestBoardId?: string;
  }
): Promise<PostResult[]> {
  const results: PostResult[] = [];

  for (const platform of platforms) {
    let result: PostResult;

    switch (platform) {
      case 'instagram':
        result = await postToInstagram(content);
        break;
      case 'facebook':
        if (!platformConfig?.facebookPageId) {
          result = { success: false, error: 'Facebook Page ID required', platform: 'facebook' };
        } else {
          result = await postToFacebook(content, platformConfig.facebookPageId);
        }
        break;
      case 'twitter':
        result = await postToTwitter(content);
        break;
      case 'linkedin':
        if (!platformConfig?.linkedInPersonUrn) {
          result = { success: false, error: 'LinkedIn Person URN required', platform: 'linkedin' };
        } else {
          result = await postToLinkedIn(content, platformConfig.linkedInPersonUrn);
        }
        break;
      case 'pinterest':
        if (!platformConfig?.pinterestBoardId) {
          result = { success: false, error: 'Pinterest Board ID required', platform: 'pinterest' };
        } else {
          result = await postToPinterest(content, platformConfig.pinterestBoardId);
        }
        break;
      default:
        result = { success: false, error: 'Unsupported platform', platform };
    }

    results.push(result);
  }

  return results;
}

export default {
  postToInstagram,
  postToFacebook,
  postToTwitter,
  postToLinkedIn,
  postToPinterest,
  postToMultiplePlatforms,
};

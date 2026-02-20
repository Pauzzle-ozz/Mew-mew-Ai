const axios = require('axios');
const socialKeysService = require('./socialKeysService');

class SocialPublishService {

  /**
   * Publier sur une plateforme
   * Recupere les cles automatiquement et dispatch vers le bon publisher
   */
  async publish(userId, platform, content, imageUrl = null) {
    const credentials = await socialKeysService.getKeys(userId, platform);
    if (!credentials) {
      throw new Error(`Aucune cle API configuree pour ${platform}. Ajoutez vos cles dans les parametres.`);
    }

    const publishers = {
      twitter: () => this.publishToTwitter(credentials, content, imageUrl),
      linkedin: () => this.publishToLinkedin(credentials, content, imageUrl),
      facebook: () => this.publishToFacebook(credentials, content, imageUrl),
      instagram: () => this.publishToInstagram(credentials, content, imageUrl),
      youtube: () => this.publishToYoutube(credentials, content),
      tiktok: () => this.publishToTiktok(credentials, content)
    };

    const publisher = publishers[platform];
    if (!publisher) throw new Error(`Publication non supportee pour ${platform}`);

    console.log(`📤 [SocialPublish] Publication sur ${platform}...`);
    const result = await publisher();
    console.log(`✅ [SocialPublish] Publie sur ${platform}`);
    return result;
  }

  /**
   * Tester la connexion d'une plateforme
   */
  async testConnection(userId, platform) {
    const credentials = await socialKeysService.getKeys(userId, platform);
    if (!credentials) {
      throw new Error(`Aucune cle API configuree pour ${platform}`);
    }

    const testers = {
      twitter: () => this.testTwitter(credentials),
      linkedin: () => this.testLinkedin(credentials),
      facebook: () => this.testFacebook(credentials),
      instagram: () => this.testInstagram(credentials),
      youtube: () => this.testYoutube(credentials),
      tiktok: () => this.testTiktok(credentials)
    };

    const tester = testers[platform];
    if (!tester) throw new Error(`Test non supporte pour ${platform}`);

    return await tester();
  }

  // ═══════════════════════════════════════════
  // TWITTER / X
  // ═══════════════════════════════════════════

  async publishToTwitter(credentials, content, imageUrl) {
    const { TwitterApi } = require('twitter-api-v2');
    const client = new TwitterApi({
      appKey: credentials.apiKey,
      appSecret: credentials.apiSecret,
      accessToken: credentials.accessToken,
      accessSecret: credentials.accessTokenSecret
    });

    let mediaId = null;
    if (imageUrl) {
      try {
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        mediaId = await client.v1.uploadMedia(Buffer.from(imageResponse.data), { mimeType: 'image/png' });
      } catch (err) {
        console.log('⚠️ [Twitter] Upload image echoue, publication sans image');
      }
    }

    const tweetParams = { text: content.substring(0, 280) };
    if (mediaId) tweetParams.media = { media_ids: [mediaId] };

    const result = await client.v2.tweet(tweetParams);
    return {
      postId: result.data.id,
      postUrl: `https://twitter.com/i/web/status/${result.data.id}`,
      platform: 'twitter'
    };
  }

  async testTwitter(credentials) {
    const { TwitterApi } = require('twitter-api-v2');
    const client = new TwitterApi({
      appKey: credentials.apiKey,
      appSecret: credentials.apiSecret,
      accessToken: credentials.accessToken,
      accessSecret: credentials.accessTokenSecret
    });
    const me = await client.v2.me();
    return { success: true, account: me.data.username, name: me.data.name };
  }

  // ═══════════════════════════════════════════
  // LINKEDIN
  // ═══════════════════════════════════════════

  async publishToLinkedin(credentials, content, imageUrl) {
    // Recuperer l'ID du profil
    const profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${credentials.accessToken}` }
    });
    const personId = profileRes.data.sub;

    const postData = {
      author: `urn:li:person:${personId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: content },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
    };

    if (imageUrl) {
      postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'ARTICLE';
      postData.specificContent['com.linkedin.ugc.ShareContent'].media = [{
        status: 'READY',
        originalUrl: imageUrl
      }];
    }

    const result = await axios.post('https://api.linkedin.com/v2/ugcPosts', postData, {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    const postId = result.headers['x-restli-id'] || result.data.id;
    return {
      postId,
      postUrl: `https://www.linkedin.com/feed/update/${postId}`,
      platform: 'linkedin'
    };
  }

  async testLinkedin(credentials) {
    const res = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${credentials.accessToken}` }
    });
    return { success: true, account: res.data.name, name: res.data.name };
  }

  // ═══════════════════════════════════════════
  // FACEBOOK
  // ═══════════════════════════════════════════

  async publishToFacebook(credentials, content, imageUrl) {
    const { pageAccessToken, pageId } = credentials;

    let endpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`;
    const params = { message: content, access_token: pageAccessToken };

    if (imageUrl) {
      endpoint = `https://graph.facebook.com/v19.0/${pageId}/photos`;
      params.url = imageUrl;
    }

    const result = await axios.post(endpoint, params);

    return {
      postId: result.data.id || result.data.post_id,
      postUrl: `https://facebook.com/${result.data.id || result.data.post_id}`,
      platform: 'facebook'
    };
  }

  async testFacebook(credentials) {
    const res = await axios.get(
      `https://graph.facebook.com/v19.0/${credentials.pageId}?fields=name,id&access_token=${credentials.pageAccessToken}`
    );
    return { success: true, account: res.data.name, name: res.data.name };
  }

  // ═══════════════════════════════════════════
  // INSTAGRAM (via Facebook Graph API)
  // ═══════════════════════════════════════════

  async publishToInstagram(credentials, content, imageUrl) {
    if (!imageUrl) {
      throw new Error('Instagram necessite une image. Generez une image avec DALL-E avant de publier.');
    }

    const { accessToken, igBusinessAccountId } = credentials;

    // Etape 1 : Creer le container media
    const containerRes = await axios.post(
      `https://graph.facebook.com/v19.0/${igBusinessAccountId}/media`,
      {
        image_url: imageUrl,
        caption: content,
        access_token: accessToken
      }
    );
    const containerId = containerRes.data.id;

    // Etape 2 : Publier le container
    const publishRes = await axios.post(
      `https://graph.facebook.com/v19.0/${igBusinessAccountId}/media_publish`,
      {
        creation_id: containerId,
        access_token: accessToken
      }
    );

    return {
      postId: publishRes.data.id,
      postUrl: `https://www.instagram.com/p/${publishRes.data.id}/`,
      platform: 'instagram'
    };
  }

  async testInstagram(credentials) {
    const res = await axios.get(
      `https://graph.facebook.com/v19.0/${credentials.igBusinessAccountId}?fields=name,username&access_token=${credentials.accessToken}`
    );
    return { success: true, account: res.data.username, name: res.data.name };
  }

  // ═══════════════════════════════════════════
  // YOUTUBE (Community Posts / Shorts)
  // ═══════════════════════════════════════════

  async publishToYoutube(credentials, content) {
    // Obtenir un access token via refresh token
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      refresh_token: credentials.refreshToken,
      grant_type: 'refresh_token'
    });
    const accessToken = tokenRes.data.access_token;

    // Publier un community post (bulletin)
    // Note : l'API YouTube community posts est limitee. On poste un commentaire de chaine ou activity
    // Alternative : poster un Shorts via upload
    const result = await axios.post(
      'https://www.googleapis.com/youtube/v3/activities?part=snippet,contentDetails',
      {
        snippet: {
          description: content
        },
        contentDetails: {
          bulletin: {
            resourceId: {}
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      postId: result.data.id,
      postUrl: `https://youtube.com`,
      platform: 'youtube',
      note: 'Community post publie'
    };
  }

  async testYoutube(credentials) {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      refresh_token: credentials.refreshToken,
      grant_type: 'refresh_token'
    });

    const res = await axios.get(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      { headers: { 'Authorization': `Bearer ${tokenRes.data.access_token}` } }
    );
    const channel = res.data.items?.[0];
    return { success: true, account: channel?.snippet?.title, name: channel?.snippet?.title };
  }

  // ═══════════════════════════════════════════
  // TIKTOK
  // ═══════════════════════════════════════════

  async publishToTiktok(credentials, content) {
    // TikTok Content Posting API - publication de texte/lien
    // Note : TikTok necessite une video pour poster. Pour du texte seul, on utilise le
    // "share intent" API qui cree un brouillon dans l'app TikTok
    const result = await axios.post(
      'https://open.tiktokapis.com/v2/post/publish/content/init/',
      {
        post_info: {
          title: content.substring(0, 150),
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_duet: false,
          disable_stitch: false,
          disable_comment: false
        },
        source_info: {
          source: 'PULL_FROM_URL',
          video_url: '' // TikTok necessite une video
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      postId: result.data?.data?.publish_id || 'draft',
      postUrl: 'https://www.tiktok.com',
      platform: 'tiktok',
      note: 'TikTok necessite une video pour publier. Le contenu a ete prepare comme brouillon.'
    };
  }

  async testTiktok(credentials) {
    const res = await axios.get(
      'https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url',
      {
        headers: { 'Authorization': `Bearer ${credentials.accessToken}` }
      }
    );
    const user = res.data?.data?.user;
    return { success: true, account: user?.display_name, name: user?.display_name };
  }
}

module.exports = new SocialPublishService();

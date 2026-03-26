import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import OAuth from 'oauth';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  const trelloApiKey = process.env.TRELLO_API_KEY;
  const trelloApiSecret = process.env.TRELLO_API_SECRET;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
  const linkedinClientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const facebookAppId = process.env.FACEBOOK_APP_ID;
  const facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
  const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
  
  const trelloCallbackUrl = `${appUrl}/auth/trello/callback`;
  const googleCallbackUrl = `${appUrl}/auth/google/callback`;
  const linkedinCallbackUrl = `${appUrl}/auth/linkedin/callback`;
  const facebookCallbackUrl = `${appUrl}/auth/facebook/callback`;

  let wordpressConfig: { siteUrl: string; appPassword: string } | null = null;

  const oauth = new OAuth.OAuth(
    'https://trello.com/1/OAuthGetRequestToken',
    'https://trello.com/1/OAuthGetAccessToken',
    trelloApiKey!,
    trelloApiSecret!,
    '1.0A',
    trelloCallbackUrl,
    'HMAC-SHA1'
  );

  const googleOAuth2Client = new google.auth.OAuth2(
    googleClientId,
    googleClientSecret,
    googleCallbackUrl
  );

  const requestTokens: Record<string, { token: string; secret: string }> = {};

  // Trello Auth Routes
  app.get('/api/auth/trello/url', (req, res) => {
    if (!trelloApiKey || !trelloApiSecret) {
      return res.status(500).json({ error: 'Trello API credentials not configured' });
    }

    oauth.getOAuthRequestToken((error, token, tokenSecret, results) => {
      if (error) {
        console.error('Error getting request token:', error);
        return res.status(500).json({ error: 'Failed to get request token' });
      }

      const sessionId = Math.random().toString(36).substring(7);
      requestTokens[sessionId] = { token, secret: tokenSecret };
      
      res.cookie('trello_session', sessionId, { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'none' 
      });

      const authUrl = `https://trello.com/1/OAuthAuthorizeToken?oauth_token=${token}&name=CaseronCommandCentre&scope=read,write&expiration=never`;
      res.json({ url: authUrl });
    });
  });

  app.get('/auth/trello/callback', (req, res) => {
    const sessionId = req.cookies.trello_session;
    const { oauth_token, oauth_verifier } = req.query;

    if (!sessionId || !requestTokens[sessionId]) {
      return res.status(400).send('Invalid session');
    }

    const { secret } = requestTokens[sessionId];

    oauth.getOAuthAccessToken(
      oauth_token as string,
      secret,
      oauth_verifier as string,
      (error, accessToken, accessTokenSecret, results) => {
        if (error) {
          console.error('Error getting access token:', error);
          return res.status(500).send('Failed to get access token');
        }

        res.cookie('trello_token', accessToken, { 
          httpOnly: true, 
          secure: true, 
          sameSite: 'none' 
        });
        
        delete requestTokens[sessionId];

        res.send(`
          <html>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'TRELLO_AUTH_SUCCESS' }, '*');
                  window.close();
                } else {
                  window.location.href = '/';
                }
              </script>
              <p>Authentication successful. This window should close automatically.</p>
            </body>
          </html>
        `);
      }
    );
  });

  // Google Auth Routes
  app.get('/api/auth/google/url', (req, res) => {
    if (!googleClientId || !googleClientSecret) {
      return res.status(500).json({ error: 'Google API credentials not configured' });
    }

    const url = googleOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify'
      ],
      prompt: 'consent'
    });
    res.json({ url });
  });

  app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await googleOAuth2Client.getToken(code as string);
      res.cookie('google_token', JSON.stringify(tokens), { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'none' 
      });
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error getting Google tokens:', error);
      res.status(500).send('Failed to get Google tokens');
    }
  });

  app.get('/api/auth/status', (req, res) => {
    res.json({ 
      trello: !!req.cookies.trello_token,
      google: !!req.cookies.google_token,
      linkedin: !!req.cookies.linkedin_token,
      facebook: !!req.cookies.facebook_token,
      wordpress: !!req.cookies.wordpress_site_url && !!req.cookies.wordpress_app_password
    });
  });

  app.post('/api/auth/logout', (req, res) => {
    const { service } = req.body;
    if (service === 'trello') res.clearCookie('trello_token');
    if (service === 'google') res.clearCookie('google_token');
    if (service === 'linkedin') res.clearCookie('linkedin_token');
    if (service === 'facebook') res.clearCookie('facebook_token');
    if (service === 'wordpress') {
      res.clearCookie('wordpress_site_url');
      res.clearCookie('wordpress_app_password');
    }
    res.json({ success: true });
  });

  // WordPress Auth/Connect
  app.post('/api/auth/wordpress/connect', (req, res) => {
    const { siteUrl, appPassword } = req.body;
    if (!siteUrl || !appPassword) {
      return res.status(400).json({ error: 'Site URL and Application Password required' });
    }

    // Set cookies for WordPress connection
    res.cookie('wordpress_site_url', siteUrl, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'none' 
    });
    res.cookie('wordpress_app_password', appPassword, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'none' 
    });

    res.json({ success: true });
  });

  // LinkedIn Auth Routes
  app.get('/api/auth/linkedin/url', (req, res) => {
    if (!linkedinClientId || !linkedinClientSecret) {
      return res.status(500).json({ error: 'LinkedIn API credentials not configured' });
    }
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(linkedinCallbackUrl)}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
    res.json({ url: authUrl });
  });

  app.get('/auth/linkedin/callback', async (req, res) => {
    const { code } = req.query;
    try {
      const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
        params: {
          grant_type: 'authorization_code',
          code: code as string,
          client_id: linkedinClientId,
          client_secret: linkedinClientSecret,
          redirect_uri: linkedinCallbackUrl
        }
      });
      res.cookie('linkedin_token', response.data.access_token, { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'none' 
      });
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'LINKEDIN_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error getting LinkedIn tokens:', error);
      res.status(500).send('Failed to get LinkedIn tokens');
    }
  });

  // Facebook Auth Routes
  app.get('/api/auth/facebook/url', (req, res) => {
    if (!facebookAppId || !facebookAppSecret) {
      return res.status(500).json({ error: 'Facebook API credentials not configured' });
    }
    const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${encodeURIComponent(facebookCallbackUrl)}&scope=pages_show_list,pages_read_engagement,instagram_basic`;
    res.json({ url: authUrl });
  });

  app.get('/auth/facebook/callback', async (req, res) => {
    const { code } = req.query;
    try {
      const response = await axios.get('https://graph.facebook.com/v12.0/oauth/access_token', {
        params: {
          client_id: facebookAppId,
          client_secret: facebookAppSecret,
          redirect_uri: facebookCallbackUrl,
          code: code as string
        }
      });
      res.cookie('facebook_token', response.data.access_token, { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'none' 
      });
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'FACEBOOK_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error getting Facebook tokens:', error);
      res.status(500).send('Failed to get Facebook tokens');
    }
  });

  // LinkedIn Stats
  app.get('/api/linkedin/stats', async (req, res) => {
    const token = req.cookies.linkedin_token;
    if (!token) return res.status(401).json({ error: 'Not connected to LinkedIn' });

    try {
      const profile = await axios.get('https://api.linkedin.com/v2/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // LinkedIn API for followers is complex, returning mock for now but using real profile info
      res.json({
        name: `${profile.data.localizedFirstName} ${profile.data.localizedLastName}`,
        followerCount: 15120 // Mock count but real connection
      });
    } catch (error) {
      console.error('Error fetching LinkedIn stats:', error);
      res.status(500).json({ error: 'Failed to fetch LinkedIn stats' });
    }
  });

  // Facebook/Instagram Stats
  app.get('/api/facebook/stats', async (req, res) => {
    const token = req.cookies.facebook_token;
    if (!token) return res.status(401).json({ error: 'Not connected to Facebook' });

    try {
      const response = await axios.get('https://graph.facebook.com/v12.0/me/accounts', {
        params: { access_token: token }
      });
      // Return first page stats
      res.json({
        pageCount: response.data.data.length,
        pages: response.data.data.map((p: any) => ({ name: p.name, id: p.id }))
      });
    } catch (error) {
      console.error('Error fetching Facebook stats:', error);
      res.status(500).json({ error: 'Failed to fetch Facebook stats' });
    }
  });

  // Gmail Stats & Messages
  app.get('/api/gmail/messages', async (req, res) => {
    const tokenStr = req.cookies.google_token;
    if (!tokenStr) return res.status(401).json({ error: 'Not connected to Google' });

    try {
      const tokens = JSON.parse(tokenStr);
      googleOAuth2Client.setCredentials(tokens);
      const gmail = google.gmail({ version: 'v1', auth: googleOAuth2Client });
      
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10,
        q: 'is:unread'
      });

      const messages = await Promise.all((response.data.messages || []).map(async (msg) => {
        const details = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!
        });
        
        const headers = details.data.payload?.headers;
        const subject = headers?.find(h => h.name === 'Subject')?.value || 'No Subject';
        const from = headers?.find(h => h.name === 'From')?.value || 'Unknown Sender';
        const date = headers?.find(h => h.name === 'Date')?.value || '';
        
        return {
          id: msg.id,
          threadId: msg.threadId,
          subject,
          from,
          date,
          snippet: details.data.snippet
        };
      }));

      res.json(messages);
    } catch (error) {
      console.error('Error fetching Gmail messages:', error);
      res.status(500).json({ error: 'Failed to fetch Gmail messages' });
    }
  });

  // Trello Stats
  app.get('/api/trello/stats', async (req, res) => {
    const token = req.cookies.trello_token;
    if (!token) return res.status(401).json({ error: 'Not connected to Trello' });

    try {
      const boards = await axios.get(`https://api.trello.com/1/members/me/boards`, {
        params: { key: trelloApiKey, token: token, fields: 'id' }
      });
      
      let totalCards = 0;
      let completedCards = 0;

      // For simplicity, just check the first 3 boards
      for (const board of boards.data.slice(0, 3)) {
        const cards = await axios.get(`https://api.trello.com/1/boards/${board.id}/cards`, {
          params: { key: trelloApiKey, token: token, fields: 'idList' }
        });
        const lists = await axios.get(`https://api.trello.com/1/boards/${board.id}/lists`, {
          params: { key: trelloApiKey, token: token, fields: 'name,id' }
        });
        
        const doneListIds = lists.data
          .filter((l: any) => l.name.toLowerCase().includes('done') || l.name.toLowerCase().includes('complete'))
          .map((l: any) => l.id);

        totalCards += cards.data.length;
        completedCards += cards.data.filter((c: any) => doneListIds.includes(c.idList)).length;
      }

      res.json({ totalCards, completedCards });
    } catch (error) {
      console.error('Error fetching Trello stats:', error);
      res.status(500).json({ error: 'Failed to fetch Trello stats' });
    }
  });

  // YouTube Stats
  app.get('/api/youtube/stats', async (req, res) => {
    const tokenStr = req.cookies.google_token;
    if (!tokenStr) return res.status(401).json({ error: 'Not connected to Google' });

    try {
      const tokens = JSON.parse(tokenStr);
      googleOAuth2Client.setCredentials(tokens);
      const youtube = google.youtube({ version: 'v3', auth: googleOAuth2Client });
      
      const response = await youtube.channels.list({
        part: ['statistics', 'snippet'],
        mine: true
      });

      if (response.data.items && response.data.items.length > 0) {
        const channel = response.data.items[0];
        res.json({
          subscriberCount: channel.statistics?.subscriberCount,
          viewCount: channel.statistics?.viewCount,
          videoCount: channel.statistics?.videoCount,
          title: channel.snippet?.title,
          thumbnail: channel.snippet?.thumbnails?.default?.url
        });
      } else {
        res.status(404).json({ error: 'No YouTube channel found' });
      }
    } catch (error) {
      console.error('Error fetching YouTube stats:', error);
      res.status(500).json({ error: 'Failed to fetch YouTube stats' });
    }
  });

  // WordPress SEO Pages
  app.get('/api/wordpress/seo-pages', async (req, res) => {
    const siteUrl = req.cookies.wordpress_site_url;
    const appPassword = req.cookies.wordpress_app_password;

    if (!siteUrl || !appPassword) {
      return res.status(401).json({ error: 'WordPress not connected' });
    }

    try {
      // Fetch pages from WordPress REST API
      const response = await axios.get(`${siteUrl}/wp-json/wp/v2/pages`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`admin:${appPassword}`).toString('base64')}`
        },
        params: {
          per_page: 20,
          _embed: 1
        }
      });

      // Map WordPress pages to our SEO page format
      // Note: Real SEO data would come from Yoast/RankMath REST API if installed
      const pages = response.data.map((page: any) => ({
        id: page.id.toString(),
        title: page.title.rendered,
        url: page.link,
        score: Math.floor(Math.random() * 40) + 60, // Mock score for now, but real pages
        status: 'Good',
        issues: [],
        lastChecked: new Date().toLocaleDateString()
      }));

      res.json(pages);
    } catch (error) {
      console.error('Error fetching WordPress pages:', error);
      res.status(500).json({ error: 'Failed to fetch WordPress pages' });
    }
  });

  // Fetch Trello Boards
  app.get('/api/trello/boards', async (req, res) => {
    const token = req.cookies.trello_token;
    if (!token) return res.status(401).json({ error: 'Not connected to Trello' });

    try {
      const response = await axios.get(`https://api.trello.com/1/members/me/boards`, {
        params: {
          key: trelloApiKey,
          token: token,
          fields: 'name,id'
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching boards:', error);
      res.status(500).json({ error: 'Failed to fetch boards' });
    }
  });

  // Fetch Trello Cards for a board
  app.get('/api/trello/cards', async (req, res) => {
    const token = req.cookies.trello_token;
    const { boardId } = req.query;
    if (!token) return res.status(401).json({ error: 'Not connected to Trello' });
    if (!boardId) return res.status(400).json({ error: 'Board ID required' });

    try {
      const response = await axios.get(`https://api.trello.com/1/boards/${boardId}/cards`, {
        params: {
          key: trelloApiKey,
          token: token,
          fields: 'name,id,desc,due,labels,idList'
        }
      });
      
      const listsResponse = await axios.get(`https://api.trello.com/1/boards/${boardId}/lists`, {
        params: {
          key: trelloApiKey,
          token: token,
          fields: 'name,id'
        }
      });

      const listsMap = listsResponse.data.reduce((acc: any, list: any) => {
        acc[list.id] = list.name;
        return acc;
      }, {});

      const cards = response.data.map((card: any) => ({
        id: card.id,
        title: card.name,
        description: card.desc,
        status: listsMap[card.idList] || 'Unknown',
        labels: card.labels.map((l: any) => l.name),
        due: card.due
      }));

      res.json(cards);
    } catch (error) {
      console.error('Error fetching cards:', error);
      res.status(500).json({ error: 'Failed to fetch cards' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

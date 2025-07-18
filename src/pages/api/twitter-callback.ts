// pages/api/twitter/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, verifier } = req.body;

  console.log('Received code:', code);
  console.log('Received verifier:', verifier);
  console.log(req.body);
  if (!verifier || typeof code !== 'string')
    return res.status(400).json({ error: 'Missing verifier or code' });

  try {
    const {
      client: loggedClient,
      accessToken,
      refreshToken,
      expiresIn,
    } = await client.loginWithOAuth2({
      code,
      codeVerifier: verifier as string,
      redirectUri: 'http://localhost:3000/create-campaign',
    });

    const user = await loggedClient.v2.me();
    return res.status(200).json({ user, accessToken });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}

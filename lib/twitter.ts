import { TwitterApi } from 'twitter-api-v2';

const getTwitterClient = (accessToken: string) => {
  return new TwitterApi(accessToken);
};

export { getTwitterClient };
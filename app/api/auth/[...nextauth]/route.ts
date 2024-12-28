import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"

export const authOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      authorization: {
        params: {
          scope: "users.read tweet.read follows.write follows.read",
          response_type: "code",
          access_type: "offline",
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log('JWT Callback Started ----------------');
      console.log('Incoming Token:', JSON.stringify(token, null, 2));
      console.log('Incoming Account:', JSON.stringify(account, null, 2));
    
      if (account) {
        console.log('Account present, creating new token');
        const newToken = {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at,
          refreshToken: account.refresh_token,
          user: {
            name: token.name,
            image: token.picture,
            id: token.sub
          }
        };
        console.log('New Token Created:', JSON.stringify(newToken, null, 2));
        return newToken;
      }
      console.log('No account, returning existing token');
      return token;
    },
    
    async session({ session, token }) {
      console.log('Session Callback Started ----------------');
      console.log('Incoming Session:', JSON.stringify(session, null, 2));
      console.log('Incoming Token:', JSON.stringify(token, null, 2));
      
      session.accessToken = token.accessToken;
      session.user = token.user;
      
      console.log('Modified Session:', JSON.stringify(session, null, 2));
      return session;
    },
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
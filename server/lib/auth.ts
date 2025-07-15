// Simplified auth configuration for development
export const authConfig = {
  providers: [],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    session: ({ session }: any) => ({
      ...session,
      user: {
        ...session.user,
        id: 'demo-user-123',
      },
    }),
  },
};

// Mock auth functions for development
export const handlers = {
  GET: () => new Response('Auth not configured', { status: 501 }),
  POST: () => new Response('Auth not configured', { status: 501 }),
};

export const auth = () => Promise.resolve(null);
export const signIn = () => Promise.resolve();
export const signOut = () => Promise.resolve();

// Simplified session function for development
export async function getServerSession() {
  // Return mock session for development
  return {
    user: {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@example.com',
    },
  };
}

// User session type
export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};
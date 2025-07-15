import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Environment variables (placeholders)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const DATABASE_URL = process.env.DATABASE_URL;

// Supabase client for auth and storage (will use placeholders)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database connection for Drizzle - only if DATABASE_URL is provided
let db: any;
if (DATABASE_URL && DATABASE_URL !== 'postgresql://user:password@host:port/database') {
  const client = postgres(DATABASE_URL);
  db = drizzle(client);
} else {
  // Mock db for development without database
  db = null;
  console.warn('DATABASE_URL not provided - database operations will be mocked');
}

export { db };

// Cloudflare R2 configuration (placeholders)
export const R2_CONFIG = {
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || 'https://your-account-id.r2.cloudflarestorage.com',
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || 'your-r2-access-key-id',
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || 'your-r2-secret-access-key',
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'jobflow-resumes',
  publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://your-bucket.your-account-id.r2.dev'
};
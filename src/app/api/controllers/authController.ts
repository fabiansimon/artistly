import { supabase } from '@/lib/supabaseClient';
import { SignUpUser } from '@/types';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

const TABLE = 'users';

export async function fetchUser(email: string) {
  console.log('fetching user...', email);
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching user: ${error.message}`);
  }

  return data;
}

export async function createUser({
  email,
  first_name,
  last_name,
  image_url,
}: SignUpUser) {
  const { data, error } = await supabase.from('users').insert({
    email,
    first_name,
    last_name,
    image_url,
  });

  if (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }

  return data;
}

export async function getUserId(request: NextRequest) {
  const session = await getServerSession({ req: request, ...authOptions });

  if (!session || !session.user?.id) {
    return false;
  }

  return session.user.id;
}

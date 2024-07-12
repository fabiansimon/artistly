import { supabase } from '@/lib/supabaseClient';
import { SignUpUser } from '@/types';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

const TABLE = 'users';

export async function fetchUserByEmail(email: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching user by email: ${error.message}`);
  }

  return data;
}

export async function fetchUserById(id: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error finding user by id: ${error.message}`);
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

export async function getUserData(request: NextRequest) {
  const session = await getServerSession({ req: request, ...authOptions });
  if (!session || !session.user) {
    return;
  }

  return {
    userId: session.user.id,
    email: session.user.email,
  };
}
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PersonalUpdate {
  id?: string;
  title: string;
  category: string;
  content: string;
  target_feeds: string[];
  card_style: string;
  media_type?: string;
  media_url?: string;
  published: boolean;
  featured: boolean;
  created_at?: string;
}

export async function getPersonalUpdates(): Promise<PersonalUpdate[]> {
  const { data, error } = await supabase
    .from('personal_updates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching updates:', error);
    return [];
  }

  return data ?? [];
}

export async function createPersonalUpdate(update: PersonalUpdate): Promise<PersonalUpdate | null> {
  const { data, error } = await supabase
    .from('personal_updates')
    .insert([update])
    .select()
    .single();

  if (error) {
    console.error('Error creating update:', error);
    return null;
  }

  return data;
}

export async function updatePersonalUpdate(id: string, update: Partial<PersonalUpdate>): Promise<PersonalUpdate | null> {
  const { data, error } = await supabase
    .from('personal_updates')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating:', error);
    return null;
  }

  return data;
}

export async function deletePersonalUpdate(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('personal_updates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting:', error);
    return false;
  }

  return true;
}

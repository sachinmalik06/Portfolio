import { supabase } from './supabase';
import type { Database } from './database.types';

type ExpertiseCard = Database['public']['Tables']['expertise_cards']['Row'];
type TimelineEntry = Database['public']['Tables']['timeline_entries']['Row'];
type Page = Database['public']['Tables']['pages']['Row'];

// --- EXPERTISE CARDS ---
export async function getExpertiseCards(includeInactive = false) {
  let query = supabase
    .from('expertise_cards')
    .select('*')
    .order('order', { ascending: true });

  if (!includeInactive) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createExpertiseCard(card: Database['public']['Tables']['expertise_cards']['Insert']) {
  const { data, error } = await supabase
    .from('expertise_cards')
    .insert(card)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateExpertiseCard(
  id: string,
  updates: Database['public']['Tables']['expertise_cards']['Update']
) {
  const { data, error } = await supabase
    .from('expertise_cards')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExpertiseCard(id: string) {
  const { error } = await supabase
    .from('expertise_cards')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// --- PAGES ---
export async function getPage(slug: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'general')
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  const settings = (data?.value as any) || { headerTitle: "CINEMATIC STRATEGY" };
  return settings;
}

export async function getProfileCardSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'profile_card')
    .single();
  
  if (error && error.code !== 'PGRST116') {
    // If not found, return defaults
    return {
      cardImageUrl: '',
    };
  }
  
  return (data?.value as any) || {
    cardImageUrl: ''
  };
}

export async function getFooterSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'footer')
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching footer settings:', error);
    return null;
  }
  
  return (data?.value as any) || null;
}

export async function updateFooterSettings(settings: any) {
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id, value')
    .eq('key', 'footer')
    .single();

  if (existing) {
    const { error } = await supabase
      .from('site_settings')
      .update({ value: settings, updated_at: new Date().toISOString() })
      .eq('key', 'footer');
    
    if (error) throw error;
    return settings;
  } else {
    const { data, error } = await supabase
      .from('site_settings')
      .insert({ key: 'footer', value: settings })
      .select()
      .single();
    
    if (error) throw error;
    return data.value as any;
  }
}

export async function getAboutFooterText() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'about_footer_text')
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching about footer text:', error);
    return null;
  }
  
  return (data?.value as any) || null;
}

export async function updateAboutFooterText(settings: any) {
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id, value')
    .eq('key', 'about_footer_text')
    .single();

  if (existing) {
    const { error } = await supabase
      .from('site_settings')
      .update({ value: settings, updated_at: new Date().toISOString() })
      .eq('key', 'about_footer_text');
    
    if (error) throw error;
    return settings;
  } else {
    const { data, error } = await supabase
      .from('site_settings')
      .insert({ key: 'about_footer_text', value: settings })
      .select()
      .single();
    
    if (error) throw error;
    return data.value as any;
  }
}

// --- META TAGS ---
export async function getMetaTags() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'meta_tags')
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching meta tags:', error);
    return null;
  }
  
  return (data?.value as any) || null;
}

export async function updateMetaTags(settings: any) {
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id, value')
    .eq('key', 'meta_tags')
    .single();

  if (existing) {
    const { error } = await supabase
      .from('site_settings')
      .update({ value: settings, updated_at: new Date().toISOString() })
      .eq('key', 'meta_tags');
    
    if (error) throw error;
    return settings;
  } else {
    const { data, error } = await supabase
      .from('site_settings')
      .insert({ key: 'meta_tags', value: settings })
      .select()
      .single();
    
    if (error) throw error;
    return data.value as any;
  }
}

export async function updateProfileCardSettings(settings: { cardImageUrl?: string }) {
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id, value')
    .eq('key', 'profile_card')
    .single();

  const currentValue = (existing?.value as any) || {};
  const newValue = {
    ...currentValue,
    ...settings
  };

  if (existing) {
    const { data, error } = await supabase
      .from('site_settings')
      .update({ value: newValue })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('site_settings')
      .insert({ key: 'profile_card', value: newValue })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export async function updatePage(
  slug: string,
  content: any,
  title?: string
) {
  const { data: existing } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('pages')
      .update({ content, ...(title ? { title } : {}) })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('pages')
      .insert({ slug, title: title || slug, content })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// --- TIMELINE ---
export async function getTimeline(includeInactive = false) {
  let query = supabase
    .from('timeline_entries')
    .select('*')
    .order('order', { ascending: true });

  if (!includeInactive) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createTimelineEntry(entry: Database['public']['Tables']['timeline_entries']['Insert']) {
  const { data, error } = await supabase
    .from('timeline_entries')
    .insert(entry)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTimelineEntry(
  id: string,
  updates: Database['public']['Tables']['timeline_entries']['Update']
) {
  const { data, error } = await supabase
    .from('timeline_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTimelineEntry(id: string) {
  const { error } = await supabase
    .from('timeline_entries')
    .delete()
    .eq('id', id);
  if (error) throw error;
}



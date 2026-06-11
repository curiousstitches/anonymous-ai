'use client';

import { createClient } from '@/lib/supabase/client';

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  model: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  tokens?: number;
  latency?: number;
  createdAt: string;
}

function isSchemaError(error: any): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const errorClass = error.code.substring(0, 2);
    if (errorClass === '42') return true;
    if (errorClass === '23') return false;
    if (errorClass === '08') return true;
  }
  if (error.message) {
    const schemaErrorPatterns = [
      /relation.*does not exist/i,
      /column.*does not exist/i,
      /function.*does not exist/i,
      /syntax error/i,
    ];
    return schemaErrorPatterns.some((p) => p.test(error.message));
  }
  return false;
}

export const conversationService = {
  async getAll(): Promise<Conversation[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        model: row.model,
        language: row.language,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (error: any) {
      if (isSchemaError(error)) throw error;
      return [];
    }
  },

  async create(title: string, model: string, language: string): Promise<Conversation | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({ user_id: user.id, title, model, language })
        .select()
        .single();

      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        model: data.model,
        language: data.language,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error: any) {
      if (isSchemaError(error)) throw error;
      return null;
    }
  },

  async updateTitle(id: string, title: string): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('conversations')
        .update({ title })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error && isSchemaError(error)) throw error;
    } catch (error: any) {
      if (isSchemaError(error)) throw error;
    }
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error && isSchemaError(error)) throw error;
    } catch (error: any) {
      if (isSchemaError(error)) throw error;
    }
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        conversationId: row.conversation_id,
        userId: row.user_id,
        role: row.role as 'user' | 'assistant',
        content: row.content,
        model: row.model,
        tokens: row.tokens,
        latency: row.latency,
        createdAt: row.created_at,
      }));
    } catch (error: any) {
      if (isSchemaError(error)) throw error;
      return [];
    }
  },

  async addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    model?: string,
    tokens?: number,
    latency?: number
  ): Promise<Message | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          role,
          content,
          model: model || null,
          tokens: tokens || null,
          latency: latency || null,
        })
        .select()
        .single();

      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }

      // Touch conversation updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)
        .eq('user_id', user.id);

      return {
        id: data.id,
        conversationId: data.conversation_id,
        userId: data.user_id,
        role: data.role,
        content: data.content,
        model: data.model,
        tokens: data.tokens,
        latency: data.latency,
        createdAt: data.created_at,
      };
    } catch (error: any) {
      if (isSchemaError(error)) throw error;
      return null;
    }
  },
};

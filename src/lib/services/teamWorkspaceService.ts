'use client';

import { createClient } from '@/lib/supabase/client';
import { isSchemaError, readLocal, subscribeToLocalStore, writeLocal } from './store-utils';

export interface TeamWorkspace {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  workspaceId: string;
  memberEmail: string;
  memberName: string;
  role: 'owner' | 'editor' | 'reviewer';
  accepted: boolean;
}

export interface TeamMessage {
  id: string;
  workspaceId: string;
  senderId: string;
  senderEmail: string;
  senderName: string;
  body: string;
  createdAt: string;
}

export interface TeamChange {
  id: string;
  workspaceId: string;
  authorId: string;
  authorName: string;
  title: string;
  summary: string;
  status: 'proposed' | 'in_progress' | 'merged';
  createdAt: string;
}

const workspaceKey = (userId: string) => `codepilot:team:workspaces:${userId}`;
const memberKey = (userId: string) => `codepilot:team:members:${userId}`;
const messageKey = (userId: string) => `codepilot:team:messages:${userId}`;
const changeKey = (userId: string) => `codepilot:team:changes:${userId}`;

function mapWorkspace(row: any): TeamWorkspace {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    description: row.description || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMember(row: any): TeamMember {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    memberEmail: row.member_email,
    memberName: row.member_name,
    role: row.role,
    accepted: row.accepted,
  };
}

function mapMessage(row: any): TeamMessage {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    senderId: row.sender_id,
    senderEmail: row.sender_email,
    senderName: row.sender_name,
    body: row.body,
    createdAt: row.created_at,
  };
}

function mapChange(row: any): TeamChange {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    authorId: row.author_id,
    authorName: row.author_name,
    title: row.title,
    summary: row.summary || '',
    status: row.status,
    createdAt: row.created_at,
  };
}

export const teamWorkspaceService = {
  subscribe(userId: string, onChange: () => void) {
    const unsubscribeWorkspaces = subscribeToLocalStore(workspaceKey(userId), onChange);
    const unsubscribeMembers = subscribeToLocalStore(memberKey(userId), onChange);
    const unsubscribeMessages = subscribeToLocalStore(messageKey(userId), onChange);
    const unsubscribeChanges = subscribeToLocalStore(changeKey(userId), onChange);
    return () => {
      unsubscribeWorkspaces();
      unsubscribeMembers();
      unsubscribeMessages();
      unsubscribeChanges();
    };
  },

  async getDashboard() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { workspaces: [], members: [], messages: [], changes: [] };

    try {
      const [workspacesResult, membersResult, messagesResult, changesResult] = await Promise.all([
        supabase.from('team_workspaces').select('*').order('updated_at', { ascending: false }),
        supabase.from('team_workspace_members').select('*'),
        supabase.from('team_workspace_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('team_workspace_changes').select('*').order('created_at', { ascending: false }),
      ]);

      if (workspacesResult.error || membersResult.error || messagesResult.error || changesResult.error) {
        const error = workspacesResult.error || membersResult.error || messagesResult.error || changesResult.error;
        if (isSchemaError(error)) throw error;
      }

      return {
        workspaces: (workspacesResult.data || []).map(mapWorkspace),
        members: (membersResult.data || []).map(mapMember),
        messages: (messagesResult.data || []).map(mapMessage),
        changes: (changesResult.data || []).map(mapChange),
      };
    } catch (error: any) {
      if (!isSchemaError(error)) return { workspaces: [], members: [], messages: [], changes: [] };
      return {
        workspaces: readLocal<TeamWorkspace[]>(workspaceKey(user.id), []),
        members: readLocal<TeamMember[]>(memberKey(user.id), []),
        messages: readLocal<TeamMessage[]>(messageKey(user.id), []),
        changes: readLocal<TeamChange[]>(changeKey(user.id), []),
      };
    }
  },

  async createWorkspace(input: { name: string; description: string; invites: { email: string; name: string; role: TeamMember['role']; }[]; }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const ownerName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Owner';

    try {
      const { data: workspaceRow, error: workspaceError } = await supabase
        .from('team_workspaces')
        .insert({ owner_id: user.id, name: input.name.trim(), description: input.description.trim() })
        .select('*')
        .single();

      if (workspaceError) {
        if (isSchemaError(workspaceError)) throw workspaceError;
        return null;
      }

      const inviteRows = [
        {
          workspace_id: workspaceRow.id,
          member_email: (user.email || '').toLowerCase(),
          member_name: ownerName,
          role: 'owner',
          accepted: true,
        },
        ...input.invites.filter((invite) => invite.email).map((invite) => ({
          workspace_id: workspaceRow.id,
          member_email: invite.email.trim().toLowerCase(),
          member_name: invite.name.trim() || invite.email.trim().split('@')[0],
          role: invite.role,
          accepted: false,
        })),
      ];

      await supabase.from('team_workspace_members').insert(inviteRows);
      return mapWorkspace(workspaceRow);
    } catch (error: any) {
      if (!isSchemaError(error)) return null;
      const nextWorkspace: TeamWorkspace = {
        id: crypto.randomUUID(),
        ownerId: user.id,
        name: input.name.trim(),
        description: input.description.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const localWorkspaces = [nextWorkspace, ...readLocal<TeamWorkspace[]>(workspaceKey(user.id), [])];
      const localMembers = [
        {
          id: crypto.randomUUID(),
          workspaceId: nextWorkspace.id,
          memberEmail: (user.email || '').toLowerCase(),
          memberName: ownerName,
          role: 'owner' as const,
          accepted: true,
        },
        ...input.invites.filter((invite) => invite.email).map((invite) => ({
          id: crypto.randomUUID(),
          workspaceId: nextWorkspace.id,
          memberEmail: invite.email.trim().toLowerCase(),
          memberName: invite.name.trim() || invite.email.trim().split('@')[0],
          role: invite.role,
          accepted: false,
        })),
      ];
      writeLocal(workspaceKey(user.id), localWorkspaces);
      writeLocal(memberKey(user.id), [...localMembers, ...readLocal<TeamMember[]>(memberKey(user.id), [])]);
      return nextWorkspace;
    }
  },

  async acceptInvitation(memberId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase.from('team_workspace_members').update({ accepted: true }).eq('id', memberId);
      if (error && isSchemaError(error)) throw error;
    } catch (error: any) {
      if (!isSchemaError(error)) return;
      const nextMembers = readLocal<TeamMember[]>(memberKey(user.id), []).map((member) => member.id === memberId ? { ...member, accepted: true } : member);
      writeLocal(memberKey(user.id), nextMembers);
    }
  },

  async sendMessage(workspaceId: string, body: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const senderName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Builder';

    const payload = {
      workspace_id: workspaceId,
      sender_id: user.id,
      sender_email: (user.email || '').toLowerCase(),
      sender_name: senderName,
      body: body.trim(),
    };

    try {
      const { data, error } = await supabase.from('team_workspace_messages').insert(payload).select('*').single();
      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return mapMessage(data);
    } catch (error: any) {
      if (!isSchemaError(error)) return null;
      const nextMessage: TeamMessage = {
        id: crypto.randomUUID(),
        workspaceId,
        senderId: user.id,
        senderEmail: payload.sender_email,
        senderName,
        body: payload.body,
        createdAt: new Date().toISOString(),
      };
      writeLocal(messageKey(user.id), [nextMessage, ...readLocal<TeamMessage[]>(messageKey(user.id), [])]);
      return nextMessage;
    }
  },

  async createChange(workspaceId: string, title: string, summary: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const authorName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Builder';

    const payload = {
      workspace_id: workspaceId,
      author_id: user.id,
      author_name: authorName,
      title: title.trim(),
      summary: summary.trim(),
      status: 'proposed',
    };

    try {
      const { data, error } = await supabase.from('team_workspace_changes').insert(payload).select('*').single();
      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return mapChange(data);
    } catch (error: any) {
      if (!isSchemaError(error)) return null;
      const nextChange: TeamChange = {
        id: crypto.randomUUID(),
        workspaceId,
        authorId: user.id,
        authorName,
        title: payload.title,
        summary: payload.summary,
        status: 'proposed',
        createdAt: new Date().toISOString(),
      };
      writeLocal(changeKey(user.id), [nextChange, ...readLocal<TeamChange[]>(changeKey(user.id), [])]);
      return nextChange;
    }
  },

  async updateChangeStatus(changeId: string, status: TeamChange['status']) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase.from('team_workspace_changes').update({ status }).eq('id', changeId);
      if (error && isSchemaError(error)) throw error;
    } catch (error: any) {
      if (!isSchemaError(error)) return;
      const nextChanges = readLocal<TeamChange[]>(changeKey(user.id), []).map((change) => change.id === changeId ? { ...change, status } : change);
      writeLocal(changeKey(user.id), nextChanges);
    }
  },
};

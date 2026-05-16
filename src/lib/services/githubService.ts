'use client';

import { createClient } from '@/lib/supabase/client';
import { isSchemaError, readLocal, subscribeToLocalStore, writeLocal } from './store-utils';

export interface GitHubRepo {
  id: string;
  userId: string;
  owner: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  defaultBranch: string;
  syncStatus: 'connected' | 'draft' | 'needs-review';
  lastSyncedAt: string;
  createdAt: string;
}

export interface GitHubIssue {
  id: string;
  repoId: string;
  userId: string;
  title: string;
  summary: string;
  labels: string[];
  status: 'open' | 'in_progress' | 'done';
  branchName: string;
  createdAt: string;
}

export interface GitHubBatch {
  id: string;
  repoId: string;
  userId: string;
  title: string;
  summary: string;
  commitMessage: string;
  releaseNotes: string;
  status: 'draft' | 'ready' | 'synced';
  createdAt: string;
}

const localReposKey = (userId: string) => `codepilot:github:repos:${userId}`;
const localIssuesKey = (userId: string) => `codepilot:github:issues:${userId}`;
const localBatchesKey = (userId: string) => `codepilot:github:batches:${userId}`;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function mapRepo(row: any): GitHubRepo {
  return {
    id: row.id,
    userId: row.user_id,
    owner: row.owner,
    name: row.name,
    description: row.description || '',
    visibility: row.visibility,
    defaultBranch: row.default_branch,
    syncStatus: row.sync_status,
    lastSyncedAt: row.last_synced_at,
    createdAt: row.created_at,
  };
}

function mapIssue(row: any): GitHubIssue {
  return {
    id: row.id,
    repoId: row.repo_id,
    userId: row.user_id,
    title: row.title,
    summary: row.summary || '',
    labels: row.labels || [],
    status: row.status,
    branchName: row.branch_name,
    createdAt: row.created_at,
  };
}

function mapBatch(row: any): GitHubBatch {
  return {
    id: row.id,
    repoId: row.repo_id,
    userId: row.user_id,
    title: row.title,
    summary: row.summary || '',
    commitMessage: row.commit_message,
    releaseNotes: row.release_notes || '',
    status: row.status,
    createdAt: row.created_at,
  };
}

export const githubService = {
  subscribe(userId: string, onChange: () => void) {
    const unsubscribeRepos = subscribeToLocalStore(localReposKey(userId), onChange);
    const unsubscribeIssues = subscribeToLocalStore(localIssuesKey(userId), onChange);
    const unsubscribeBatches = subscribeToLocalStore(localBatchesKey(userId), onChange);
    return () => {
      unsubscribeRepos();
      unsubscribeIssues();
      unsubscribeBatches();
    };
  },

  async getDashboard() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { repos: [], issues: [], batches: [] };

    try {
      const [reposResult, issuesResult, batchesResult] = await Promise.all([
        supabase.from('github_repos').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('github_issues').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('github_change_batches').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);

      if (reposResult.error || issuesResult.error || batchesResult.error) {
        const error = reposResult.error || issuesResult.error || batchesResult.error;
        if (isSchemaError(error)) throw error;
      }

      return {
        repos: (reposResult.data || []).map(mapRepo),
        issues: (issuesResult.data || []).map(mapIssue),
        batches: (batchesResult.data || []).map(mapBatch),
      };
    } catch (error: any) {
      if (!isSchemaError(error)) {
        return { repos: [], issues: [], batches: [] };
      }

      return {
        repos: readLocal<GitHubRepo[]>(localReposKey(user.id), []),
        issues: readLocal<GitHubIssue[]>(localIssuesKey(user.id), []),
        batches: readLocal<GitHubBatch[]>(localBatchesKey(user.id), []),
      };
    }
  },

  async createRepo(input: { owner: string; name: string; description: string; visibility: 'public' | 'private'; defaultBranch: string; }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const payload = {
      user_id: user.id,
      owner: input.owner.trim(),
      name: input.name.trim(),
      description: input.description.trim(),
      visibility: input.visibility,
      default_branch: input.defaultBranch.trim() || 'main',
      sync_status: 'connected',
      last_synced_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase.from('github_repos').insert(payload).select('*').single();
      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return mapRepo(data);
    } catch (error: any) {
      if (!isSchemaError(error)) return null;
      const nextRepo: GitHubRepo = {
        id: crypto.randomUUID(),
        userId: user.id,
        owner: payload.owner,
        name: payload.name,
        description: payload.description,
        visibility: payload.visibility,
        defaultBranch: payload.default_branch,
        syncStatus: 'connected',
        lastSyncedAt: payload.last_synced_at,
        createdAt: new Date().toISOString(),
      };
      const nextRepos = [nextRepo, ...readLocal<GitHubRepo[]>(localReposKey(user.id), [])];
      writeLocal(localReposKey(user.id), nextRepos);
      return nextRepo;
    }
  },

  async createIssue(input: { repoId: string; title: string; summary: string; labels: string[]; }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const branchName = `feature/${slugify(input.title) || 'new-task'}`;
    const payload = {
      repo_id: input.repoId,
      user_id: user.id,
      title: input.title.trim(),
      summary: input.summary.trim(),
      labels: input.labels,
      status: 'open',
      branch_name: branchName,
    };

    try {
      const { data, error } = await supabase.from('github_issues').insert(payload).select('*').single();
      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return mapIssue(data);
    } catch (error: any) {
      if (!isSchemaError(error)) return null;
      const nextIssue: GitHubIssue = {
        id: crypto.randomUUID(),
        repoId: input.repoId,
        userId: user.id,
        title: payload.title,
        summary: payload.summary,
        labels: payload.labels,
        status: 'open',
        branchName,
        createdAt: new Date().toISOString(),
      };
      const nextIssues = [nextIssue, ...readLocal<GitHubIssue[]>(localIssuesKey(user.id), [])];
      writeLocal(localIssuesKey(user.id), nextIssues);
      return nextIssue;
    }
  },

  async createBatch(input: { repoId: string; title: string; summary: string; commitMessage: string; releaseNotes: string; }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const payload = {
      repo_id: input.repoId,
      user_id: user.id,
      title: input.title.trim(),
      summary: input.summary.trim(),
      commit_message: input.commitMessage.trim(),
      release_notes: input.releaseNotes.trim(),
      status: 'ready',
    };

    try {
      const { data, error } = await supabase.from('github_change_batches').insert(payload).select('*').single();
      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return mapBatch(data);
    } catch (error: any) {
      if (!isSchemaError(error)) return null;
      const nextBatch: GitHubBatch = {
        id: crypto.randomUUID(),
        repoId: input.repoId,
        userId: user.id,
        title: payload.title,
        summary: payload.summary,
        commitMessage: payload.commit_message,
        releaseNotes: payload.release_notes,
        status: 'ready',
        createdAt: new Date().toISOString(),
      };
      const nextBatches = [nextBatch, ...readLocal<GitHubBatch[]>(localBatchesKey(user.id), [])];
      writeLocal(localBatchesKey(user.id), nextBatches);
      return nextBatch;
    }
  },

  async updateIssueStatus(issueId: string, status: GitHubIssue['status']) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase.from('github_issues').update({ status }).eq('id', issueId).eq('user_id', user.id);
      if (error && isSchemaError(error)) throw error;
    } catch (error: any) {
      if (!isSchemaError(error)) return;
      const nextIssues = readLocal<GitHubIssue[]>(localIssuesKey(user.id), []).map((issue) => issue.id === issueId ? { ...issue, status } : issue);
      writeLocal(localIssuesKey(user.id), nextIssues);
    }
  },
};

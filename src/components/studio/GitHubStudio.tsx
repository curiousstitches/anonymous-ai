'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GitBranch, ListTodo, RefreshCcw, Rocket } from 'lucide-react';

import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { githubService, type GitHubBatch, type GitHubIssue, type GitHubRepo } from '@/lib/services/githubService';
import { Panel, Pill, SectionHeader } from './StudioPrimitives';

type RepoForm = {
  owner: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  defaultBranch: string;
};

type IssueForm = {
  repoId: string;
  title: string;
  summary: string;
  labels: string;
};

type BatchForm = {
  repoId: string;
  title: string;
  summary: string;
  commitMessage: string;
  releaseNotes: string;
};

export default function GitHubStudio() {
  const { user } = useAuth();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [batches, setBatches] = useState<GitHubBatch[]>([]);
  const [loading, setLoading] = useState(true);

  const repoForm = useForm<RepoForm>({ defaultValues: { owner: '', name: '', description: '', visibility: 'private', defaultBranch: 'main' } });
  const issueForm = useForm<IssueForm>({ defaultValues: { repoId: '', title: '', summary: '', labels: 'enhancement,ai' } });
  const batchForm = useForm<BatchForm>({ defaultValues: { repoId: '', title: '', summary: '', commitMessage: '', releaseNotes: '' } });

  const loadDashboard = async () => {
    setLoading(true);
    const dashboard = await githubService.getDashboard();
    setRepos(dashboard.repos);
    setIssues(dashboard.issues);
    setBatches(dashboard.batches);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = githubService.subscribe(user.id, loadDashboard);
    const interval = window.setInterval(loadDashboard, 5000);
    return () => {
      unsubscribe();
      window.clearInterval(interval);
    };
  }, [user]);

  const repoOptions = useMemo(() => repos.map((repo) => ({ label: `${repo.owner}/${repo.name}`, value: repo.id })), [repos]);

  const onCreateRepo = repoForm.handleSubmit(async (values) => {
    const repo = await githubService.createRepo(values);
    if (!repo) {
      toast.error('Could not save the repository workflow.');
      return;
    }
    toast.success(`Connected ${repo.owner}/${repo.name}`);
    repoForm.reset({ owner: values.owner, name: '', description: '', visibility: values.visibility, defaultBranch: values.defaultBranch });
    loadDashboard();
  });

  const onCreateIssue = issueForm.handleSubmit(async (values) => {
    const issue = await githubService.createIssue({
      repoId: values.repoId,
      title: values.title,
      summary: values.summary,
      labels: values.labels.split(',').map((label) => label.trim()).filter(Boolean),
    });
    if (!issue) {
      toast.error('Could not create the issue card.');
      return;
    }
    toast.success(`Issue ready with branch ${issue.branchName}`);
    issueForm.reset({ ...values, title: '', summary: '' });
    loadDashboard();
  });

  const onCreateBatch = batchForm.handleSubmit(async (values) => {
    const batch = await githubService.createBatch(values);
    if (!batch) {
      toast.error('Could not create the change batch.');
      return;
    }
    toast.success(`Batch "${batch.title}" is ready`);
    batchForm.reset({ ...values, title: '', summary: '', commitMessage: '', releaseNotes: '' });
    loadDashboard();
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="GitHub workflows"
        title="Treat repositories, issues, branches, and release batches as core AI workflow objects."
        description="This section gives GitHub a dedicated operational surface: connect repositories, turn work into issue cards, prepare branch names, and generate commit or release-ready change batches."
        actions={
          <>
            <Pill tone="success">Repo workflow active</Pill>
            <button onClick={loadDashboard} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10">
              <RefreshCcw className="h-4 w-4" /> Refresh
            </button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="p-6">
          <div className="text-4xl font-semibold text-white">{repos.length}</div>
          <p className="mt-3 text-lg font-medium text-white">Tracked repositories</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Each repo can hold AI-planned issues and change batches for safer implementation cycles.</p>
        </Panel>
        <Panel className="p-6">
          <div className="text-4xl font-semibold text-white">{issues.length}</div>
          <p className="mt-3 text-lg font-medium text-white">Issue cards</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Translate product work into issue summaries, labels, and pre-generated feature branch names.</p>
        </Panel>
        <Panel className="p-6">
          <div className="text-4xl font-semibold text-white">{batches.length}</div>
          <p className="mt-3 text-lg font-medium text-white">Change batches</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Keep commit messaging and release note drafts close to the AI workflow instead of scattering them elsewhere.</p>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-white" />
            <div>
              <p className="text-lg font-medium text-white">Connect repository workflow</p>
              <p className="text-sm text-slate-400">Manual repo connection keeps the feature working now, even before external OAuth keys are added.</p>
            </div>
          </div>

          <form className="space-y-3" onSubmit={onCreateRepo}>
            <input className="input-base" placeholder="Owner or org" {...repoForm.register('owner', { required: true })} />
            <input className="input-base" placeholder="Repository name" {...repoForm.register('name', { required: true })} />
            <textarea className="input-base min-h-24" placeholder="What is this repo for?" {...repoForm.register('description')} />
            <div className="grid gap-3 md:grid-cols-2">
              <select className="input-base" {...repoForm.register('visibility')}>
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
              <input className="input-base" placeholder="Default branch" {...repoForm.register('defaultBranch', { required: true })} />
            </div>
            <button className="btn-primary" type="submit">Save repository workflow</button>
          </form>
        </Panel>

        <Panel className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <ListTodo className="h-5 w-5 text-cyan-300" />
            <div>
              <p className="text-lg font-medium text-white">Turn work into issue cards</p>
              <p className="text-sm text-slate-400">Create actionable AI issue cards that already include labels and a suggested branch.</p>
            </div>
          </div>
          <form className="space-y-3" onSubmit={onCreateIssue}>
            <select className="input-base" {...issueForm.register('repoId', { required: true })}>
              <option value="">Choose repository</option>
              {repoOptions.map((repo) => (
                <option key={repo.value} value={repo.value}>{repo.label}</option>
              ))}
            </select>
            <input className="input-base" placeholder="Issue title" {...issueForm.register('title', { required: true })} />
            <textarea className="input-base min-h-24" placeholder="Implementation summary" {...issueForm.register('summary', { required: true })} />
            <input className="input-base" placeholder="Labels, comma separated" {...issueForm.register('labels')} />
            <button className="btn-primary" type="submit" disabled={repos.length === 0}>Create issue card</button>
          </form>
        </Panel>
      </div>

      <Panel className="space-y-5 p-6">
        <div className="flex items-center gap-3">
          <Rocket className="h-5 w-5 text-fuchsia-200" />
          <div>
            <p className="text-lg font-medium text-white">Prepare commit and release batches</p>
            <p className="text-sm text-slate-400">Generate structured commit-ready batches so GitHub handoff stays aligned with the AI builder output.</p>
          </div>
        </div>
        <form className="grid gap-3 lg:grid-cols-2" onSubmit={onCreateBatch}>
          <select className="input-base lg:col-span-2" {...batchForm.register('repoId', { required: true })}>
            <option value="">Choose repository</option>
            {repoOptions.map((repo) => (
              <option key={repo.value} value={repo.value}>{repo.label}</option>
            ))}
          </select>
          <input className="input-base" placeholder="Batch title" {...batchForm.register('title', { required: true })} />
          <input className="input-base" placeholder="Commit message" {...batchForm.register('commitMessage', { required: true })} />
          <textarea className="input-base min-h-24 lg:col-span-2" placeholder="What changed in this batch?" {...batchForm.register('summary', { required: true })} />
          <textarea className="input-base min-h-28 lg:col-span-2" placeholder="Release notes" {...batchForm.register('releaseNotes', { required: true })} />
          <button className="btn-primary lg:col-span-2" type="submit" disabled={repos.length === 0}>Create change batch</button>
        </form>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="space-y-4 p-6 xl:col-span-1">
          <p className="text-lg font-medium text-white">Repositories</p>
          {loading ? <p className="text-sm text-slate-400">Loading…</p> : repos.length === 0 ? <p className="text-sm text-slate-400">No repositories yet.</p> : repos.map((repo) => (
            <div key={repo.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-medium text-white">{repo.owner}/{repo.name}</p>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">{repo.visibility}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{repo.description || 'No description yet.'}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-white/10 px-2 py-1">{repo.defaultBranch}</span>
                <span className="rounded-full border border-white/10 px-2 py-1">{repo.syncStatus}</span>
              </div>
            </div>
          ))}
        </Panel>

        <Panel className="space-y-4 p-6 xl:col-span-1">
          <p className="text-lg font-medium text-white">Issue queue</p>
          {loading ? <p className="text-sm text-slate-400">Loading…</p> : issues.length === 0 ? <p className="text-sm text-slate-400">No issue cards yet.</p> : issues.map((issue) => (
            <div key={issue.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-medium text-white">{issue.title}</p>
                <select className="rounded-full border border-white/10 bg-transparent px-3 py-1 text-xs text-slate-200" value={issue.status} onChange={(event) => githubService.updateIssueStatus(issue.id, event.target.value as GitHubIssue['status']).then(loadDashboard)}>
                  <option value="open">open</option>
                  <option value="in_progress">in progress</option>
                  <option value="done">done</option>
                </select>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{issue.summary}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-cyan-200">
                <GitBranch className="h-3.5 w-3.5" /> {issue.branchName}
              </div>
            </div>
          ))}
        </Panel>

        <Panel className="space-y-4 p-6 xl:col-span-1">
          <p className="text-lg font-medium text-white">Release batches</p>
          {loading ? <p className="text-sm text-slate-400">Loading…</p> : batches.length === 0 ? <p className="text-sm text-slate-400">No change batches yet.</p> : batches.map((batch) => (
            <div key={batch.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-medium text-white">{batch.title}</p>
                <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-200">{batch.status}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{batch.summary}</p>
              <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-300">
                {batch.commitMessage}
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

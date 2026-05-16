'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageSquareText, Plus, Users, WandSparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { teamWorkspaceService, type TeamChange, type TeamMember, type TeamMessage, type TeamWorkspace } from '@/lib/services/teamWorkspaceService';
import { Panel, Pill, SectionHeader } from './StudioPrimitives';

type WorkspaceForm = {
  name: string;
  description: string;
  inviteEmailOne: string;
  inviteNameOne: string;
  inviteRoleOne: TeamMember['role'];
  inviteEmailTwo: string;
  inviteNameTwo: string;
  inviteRoleTwo: TeamMember['role'];
};

type MessageForm = { body: string };
type ChangeForm = { title: string; summary: string };

export default function TeamWorkspaceStudio() {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<TeamWorkspace[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [changes, setChanges] = useState<TeamChange[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const workspaceForm = useForm<WorkspaceForm>({
    defaultValues: {
      name: '',
      description: '',
      inviteEmailOne: '',
      inviteNameOne: '',
      inviteRoleOne: 'editor',
      inviteEmailTwo: '',
      inviteNameTwo: '',
      inviteRoleTwo: 'reviewer',
    },
  });
  const messageForm = useForm<MessageForm>({ defaultValues: { body: '' } });
  const changeForm = useForm<ChangeForm>({ defaultValues: { title: '', summary: '' } });

  const loadDashboard = async () => {
    setLoading(true);
    const dashboard = await teamWorkspaceService.getDashboard();
    setWorkspaces(dashboard.workspaces);
    setMembers(dashboard.members);
    setMessages(dashboard.messages);
    setChanges(dashboard.changes);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = teamWorkspaceService.subscribe(user.id, loadDashboard);
    const interval = window.setInterval(loadDashboard, 3500);
    return () => {
      unsubscribe();
      window.clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    if (!activeWorkspaceId && workspaces[0]) {
      setActiveWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, activeWorkspaceId]);

  const activeMembers = useMemo(() => members.filter((member) => member.workspaceId === activeWorkspaceId), [members, activeWorkspaceId]);
  const activeMessages = useMemo(() => messages.filter((message) => message.workspaceId === activeWorkspaceId).slice().reverse(), [messages, activeWorkspaceId]);
  const activeChanges = useMemo(() => changes.filter((change) => change.workspaceId === activeWorkspaceId), [changes, activeWorkspaceId]);

  const onCreateWorkspace = workspaceForm.handleSubmit(async (values) => {
    const invites = [
      { email: values.inviteEmailOne, name: values.inviteNameOne, role: values.inviteRoleOne },
      { email: values.inviteEmailTwo, name: values.inviteNameTwo, role: values.inviteRoleTwo },
    ].filter((invite) => invite.email.trim());

    const workspace = await teamWorkspaceService.createWorkspace({
      name: values.name,
      description: values.description,
      invites,
    });

    if (!workspace) {
      toast.error('Could not create the team workspace.');
      return;
    }

    toast.success(`Workspace ${workspace.name} created`);
    workspaceForm.reset();
    setActiveWorkspaceId(workspace.id);
    loadDashboard();
  });

  const onSendMessage = messageForm.handleSubmit(async (values) => {
    if (!activeWorkspaceId) return;
    const result = await teamWorkspaceService.sendMessage(activeWorkspaceId, values.body);
    if (!result) {
      toast.error('Could not send the team message.');
      return;
    }
    messageForm.reset();
    loadDashboard();
  });

  const onCreateChange = changeForm.handleSubmit(async (values) => {
    if (!activeWorkspaceId) return;
    const result = await teamWorkspaceService.createChange(activeWorkspaceId, values.title, values.summary);
    if (!result) {
      toast.error('Could not create the shared change card.');
      return;
    }
    toast.success('Shared change added');
    changeForm.reset();
    loadDashboard();
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Team workspace"
        title="Collaborative rooms for team chat, shared changes, and live-style polling updates."
        description="This adds a collaboration layer on top of the builder: create workspaces, invite teammates by email, send team chat messages, and track shared code changes in one place."
        actions={
          <>
            <Pill tone="success">Polling live updates</Pill>
            <Pill>Email-based member access</Pill>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="p-6">
          <div className="text-4xl font-semibold text-white">{workspaces.length}</div>
          <p className="mt-3 text-lg font-medium text-white">Workspace rooms</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Separate spaces for app squads, clients, or internal product streams.</p>
        </Panel>
        <Panel className="p-6">
          <div className="text-4xl font-semibold text-white">{members.filter((member) => member.accepted).length}</div>
          <p className="mt-3 text-lg font-medium text-white">Accepted collaborators</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Members can be invited by email and accept access inside their authenticated session.</p>
        </Panel>
        <Panel className="p-6">
          <div className="text-4xl font-semibold text-white">{changes.length}</div>
          <p className="mt-3 text-lg font-medium text-white">Shared change cards</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Track proposed, in-progress, and merged work without losing team context.</p>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-cyan-300" />
            <div>
              <p className="text-lg font-medium text-white">Create a workspace</p>
              <p className="text-sm text-slate-400">Invite up to two teammates right away and expand later from the database-backed model.</p>
            </div>
          </div>
          <form className="space-y-3" onSubmit={onCreateWorkspace}>
            <input className="input-base" placeholder="Workspace name" {...workspaceForm.register('name', { required: true })} />
            <textarea className="input-base min-h-24" placeholder="What is this workspace focused on?" {...workspaceForm.register('description')} />
            <div className="grid gap-3 md:grid-cols-3">
              <input className="input-base md:col-span-2" placeholder="Invite email" {...workspaceForm.register('inviteEmailOne')} />
              <input className="input-base" placeholder="Display name" {...workspaceForm.register('inviteNameOne')} />
              <select className="input-base md:col-span-3" {...workspaceForm.register('inviteRoleOne')}>
                <option value="editor">editor</option>
                <option value="reviewer">reviewer</option>
              </select>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <input className="input-base md:col-span-2" placeholder="Second invite email" {...workspaceForm.register('inviteEmailTwo')} />
              <input className="input-base" placeholder="Second display name" {...workspaceForm.register('inviteNameTwo')} />
              <select className="input-base md:col-span-3" {...workspaceForm.register('inviteRoleTwo')}>
                <option value="editor">editor</option>
                <option value="reviewer">reviewer</option>
              </select>
            </div>
            <button className="btn-primary" type="submit">Create workspace</button>
          </form>
        </Panel>

        <Panel className="space-y-4 p-6">
          <p className="text-lg font-medium text-white">Your rooms</p>
          {loading ? <p className="text-sm text-slate-400">Loading…</p> : workspaces.length === 0 ? <p className="text-sm text-slate-400">No workspaces yet.</p> : (
            <div className="grid gap-3 lg:grid-cols-2">
              {workspaces.map((workspace) => (
                <button key={workspace.id} onClick={() => setActiveWorkspaceId(workspace.id)} className={`rounded-[1.5rem] border p-4 text-left transition ${activeWorkspaceId === workspace.id ? 'border-cyan-300/30 bg-cyan-400/10' : 'border-white/10 bg-white/5'}`}>
                  <p className="text-base font-medium text-white">{workspace.name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{workspace.description || 'No description yet.'}</p>
                </button>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr_1fr]">
        <Panel className="space-y-4 p-6">
          <p className="text-lg font-medium text-white">Members</p>
          {!activeWorkspaceId ? <p className="text-sm text-slate-400">Select a workspace.</p> : activeMembers.length === 0 ? <p className="text-sm text-slate-400">No members yet.</p> : activeMembers.map((member) => (
            <div key={member.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">{member.memberName}</p>
                  <p className="text-xs text-slate-400">{member.memberEmail}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${member.accepted ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300' : 'border-amber-400/20 bg-amber-500/10 text-amber-200'}`}>
                  {member.accepted ? 'accepted' : 'pending'}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-300">{member.role}</span>
                {!member.accepted && user?.email?.toLowerCase() === member.memberEmail.toLowerCase() ? (
                  <button className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200" onClick={() => teamWorkspaceService.acceptInvitation(member.id).then(() => { toast.success('Invitation accepted'); loadDashboard(); })}>
                    Accept
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </Panel>

        <Panel className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <MessageSquareText className="h-5 w-5 text-fuchsia-200" />
            <div>
              <p className="text-lg font-medium text-white">Team chat</p>
              <p className="text-sm text-slate-400">Live-style collaboration updates refresh automatically.</p>
            </div>
          </div>
          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-2">
            {!activeWorkspaceId ? <p className="text-sm text-slate-400">Select a workspace.</p> : activeMessages.length === 0 ? <p className="text-sm text-slate-400">No messages yet.</p> : activeMessages.map((message) => (
              <div key={message.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">{message.senderName}</p>
                  <span className="text-xs text-slate-500">{new Date(message.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{message.body}</p>
              </div>
            ))}
          </div>
          <form className="space-y-3" onSubmit={onSendMessage}>
            <textarea className="input-base min-h-24" placeholder="Share a team update" {...messageForm.register('body', { required: true })} />
            <button className="btn-primary" type="submit" disabled={!activeWorkspaceId}>Send team message</button>
          </form>
        </Panel>

        <Panel className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <WandSparkles className="h-5 w-5 text-emerald-300" />
            <div>
              <p className="text-lg font-medium text-white">Shared changes</p>
              <p className="text-sm text-slate-400">Track what the team is proposing or merging.</p>
            </div>
          </div>
          <div className="space-y-3">
            {activeChanges.length === 0 ? <p className="text-sm text-slate-400">No shared changes yet.</p> : activeChanges.map((change) => (
              <div key={change.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">{change.title}</p>
                  <select className="rounded-full border border-white/10 bg-transparent px-3 py-1 text-xs text-slate-200" value={change.status} onChange={(event) => teamWorkspaceService.updateChangeStatus(change.id, event.target.value as TeamChange['status']).then(loadDashboard)}>
                    <option value="proposed">proposed</option>
                    <option value="in_progress">in progress</option>
                    <option value="merged">merged</option>
                  </select>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{change.summary}</p>
                <p className="mt-3 text-xs text-slate-500">{change.authorName}</p>
              </div>
            ))}
          </div>
          <form className="space-y-3" onSubmit={onCreateChange}>
            <input className="input-base" placeholder="Change title" {...changeForm.register('title', { required: true })} />
            <textarea className="input-base min-h-24" placeholder="What code change is being proposed?" {...changeForm.register('summary', { required: true })} />
            <button className="btn-primary" type="submit" disabled={!activeWorkspaceId}>
              <Plus className="h-4 w-4" /> Add shared change
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
}

-- GitHub workflows, team collaboration, and billing/premium unlocks

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.github_repos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    owner TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    visibility TEXT NOT NULL CHECK (visibility IN ('public', 'private')),
    default_branch TEXT NOT NULL DEFAULT 'main',
    sync_status TEXT NOT NULL DEFAULT 'connected' CHECK (sync_status IN ('connected', 'draft', 'needs-review')),
    last_synced_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.github_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id UUID NOT NULL REFERENCES public.github_repos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT DEFAULT '',
    labels TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done')),
    branch_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.github_change_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id UUID NOT NULL REFERENCES public.github_repos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT DEFAULT '',
    commit_message TEXT NOT NULL,
    release_notes TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'synced')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.team_workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.team_workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.team_workspaces(id) ON DELETE CASCADE,
    member_email TEXT NOT NULL,
    member_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'reviewer')),
    accepted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (workspace_id, member_email)
);

CREATE TABLE IF NOT EXISTS public.team_workspace_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.team_workspaces(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_email TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.team_workspace_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.team_workspaces(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'in_progress', 'merged')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.billing_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL DEFAULT 'Free Builder Lane',
    monthly_budget INTEGER NOT NULL DEFAULT 0,
    premium_adult_themes_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.premium_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_name TEXT NOT NULL,
    monthly_price INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trial', 'canceled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.billing_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('simulated-paid', 'active', 'canceled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_github_repos_user_id ON public.github_repos(user_id);
CREATE INDEX IF NOT EXISTS idx_github_issues_user_id ON public.github_issues(user_id);
CREATE INDEX IF NOT EXISTS idx_github_batches_user_id ON public.github_change_batches(user_id);
CREATE INDEX IF NOT EXISTS idx_team_workspaces_owner_id ON public.team_workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_workspace_id ON public.team_workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_team_messages_workspace_id ON public.team_workspace_messages(workspace_id);
CREATE INDEX IF NOT EXISTS idx_team_changes_workspace_id ON public.team_workspace_changes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_billing_profiles_user_id ON public.billing_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_unlocks_user_id ON public.premium_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_user_id ON public.billing_events(user_id);

ALTER TABLE public.github_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_change_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_workspace_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_workspace_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_manage_own_github_repos" ON public.github_repos;
CREATE POLICY "users_manage_own_github_repos"
ON public.github_repos
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_own_github_issues" ON public.github_issues;
CREATE POLICY "users_manage_own_github_issues"
ON public.github_issues
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_own_github_batches" ON public.github_change_batches;
CREATE POLICY "users_manage_own_github_batches"
ON public.github_change_batches
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "owners_and_members_view_team_workspaces" ON public.team_workspaces;
CREATE POLICY "owners_and_members_view_team_workspaces"
ON public.team_workspaces
FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.team_workspace_members members
    WHERE members.workspace_id = team_workspaces.id
      AND lower(members.member_email) = lower(auth.jwt() ->> 'email')
      AND members.accepted = TRUE
  )
);

DROP POLICY IF EXISTS "owners_create_team_workspaces" ON public.team_workspaces;
CREATE POLICY "owners_create_team_workspaces"
ON public.team_workspaces
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "owners_update_team_workspaces" ON public.team_workspaces;
CREATE POLICY "owners_update_team_workspaces"
ON public.team_workspaces
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "owners_delete_team_workspaces" ON public.team_workspaces;
CREATE POLICY "owners_delete_team_workspaces"
ON public.team_workspaces
FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "owners_and_members_view_team_members" ON public.team_workspace_members;
CREATE POLICY "owners_and_members_view_team_members"
ON public.team_workspace_members
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.team_workspaces workspaces
    WHERE workspaces.id = team_workspace_members.workspace_id
      AND (
        workspaces.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.team_workspace_members members
          WHERE members.workspace_id = workspaces.id
            AND lower(members.member_email) = lower(auth.jwt() ->> 'email')
            AND members.accepted = TRUE
        )
      )
  )
);

DROP POLICY IF EXISTS "owners_invite_team_members" ON public.team_workspace_members;
CREATE POLICY "owners_invite_team_members"
ON public.team_workspace_members
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.team_workspaces workspaces
    WHERE workspaces.id = team_workspace_members.workspace_id
      AND workspaces.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "owners_or_member_accept_updates" ON public.team_workspace_members;
CREATE POLICY "owners_or_member_accept_updates"
ON public.team_workspace_members
FOR UPDATE
TO authenticated
USING (
  lower(member_email) = lower(auth.jwt() ->> 'email')
  OR EXISTS (
    SELECT 1 FROM public.team_workspaces workspaces
    WHERE workspaces.id = team_workspace_members.workspace_id
      AND workspaces.owner_id = auth.uid()
  )
)
WITH CHECK (
  lower(member_email) = lower(auth.jwt() ->> 'email')
  OR EXISTS (
    SELECT 1 FROM public.team_workspaces workspaces
    WHERE workspaces.id = team_workspace_members.workspace_id
      AND workspaces.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "owners_and_members_view_messages" ON public.team_workspace_messages;
CREATE POLICY "owners_and_members_view_messages"
ON public.team_workspace_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.team_workspaces workspaces
    WHERE workspaces.id = team_workspace_messages.workspace_id
      AND (
        workspaces.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.team_workspace_members members
          WHERE members.workspace_id = workspaces.id
            AND lower(members.member_email) = lower(auth.jwt() ->> 'email')
            AND members.accepted = TRUE
        )
      )
  )
);

DROP POLICY IF EXISTS "owners_and_members_create_messages" ON public.team_workspace_messages;
CREATE POLICY "owners_and_members_create_messages"
ON public.team_workspace_messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.team_workspaces workspaces
    WHERE workspaces.id = team_workspace_messages.workspace_id
      AND (
        workspaces.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.team_workspace_members members
          WHERE members.workspace_id = workspaces.id
            AND lower(members.member_email) = lower(auth.jwt() ->> 'email')
            AND members.accepted = TRUE
        )
      )
  )
);

DROP POLICY IF EXISTS "owners_and_members_view_changes" ON public.team_workspace_changes;
CREATE POLICY "owners_and_members_view_changes"
ON public.team_workspace_changes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.team_workspaces workspaces
    WHERE workspaces.id = team_workspace_changes.workspace_id
      AND (
        workspaces.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.team_workspace_members members
          WHERE members.workspace_id = workspaces.id
            AND lower(members.member_email) = lower(auth.jwt() ->> 'email')
            AND members.accepted = TRUE
        )
      )
  )
);

DROP POLICY IF EXISTS "owners_and_members_create_changes" ON public.team_workspace_changes;
CREATE POLICY "owners_and_members_create_changes"
ON public.team_workspace_changes
FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.team_workspaces workspaces
    WHERE workspaces.id = team_workspace_changes.workspace_id
      AND (
        workspaces.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.team_workspace_members members
          WHERE members.workspace_id = workspaces.id
            AND lower(members.member_email) = lower(auth.jwt() ->> 'email')
            AND members.accepted = TRUE
        )
      )
  )
);

DROP POLICY IF EXISTS "owners_and_members_update_changes" ON public.team_workspace_changes;
CREATE POLICY "owners_and_members_update_changes"
ON public.team_workspace_changes
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.team_workspaces workspaces
    WHERE workspaces.id = team_workspace_changes.workspace_id
      AND (
        workspaces.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.team_workspace_members members
          WHERE members.workspace_id = workspaces.id
            AND lower(members.member_email) = lower(auth.jwt() ->> 'email')
            AND members.accepted = TRUE
        )
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.team_workspaces workspaces
    WHERE workspaces.id = team_workspace_changes.workspace_id
      AND (
        workspaces.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.team_workspace_members members
          WHERE members.workspace_id = workspaces.id
            AND lower(members.member_email) = lower(auth.jwt() ->> 'email')
            AND members.accepted = TRUE
        )
      )
  )
);

DROP POLICY IF EXISTS "users_manage_own_billing_profile" ON public.billing_profiles;
CREATE POLICY "users_manage_own_billing_profile"
ON public.billing_profiles
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_own_premium_unlocks" ON public.premium_unlocks;
CREATE POLICY "users_manage_own_premium_unlocks"
ON public.premium_unlocks
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_own_billing_events" ON public.billing_events;
CREATE POLICY "users_manage_own_billing_events"
ON public.billing_events
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP TRIGGER IF EXISTS update_team_workspaces_updated_at ON public.team_workspaces;
CREATE TRIGGER update_team_workspaces_updated_at
    BEFORE UPDATE ON public.team_workspaces
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_billing_profiles_updated_at ON public.billing_profiles;
CREATE TRIGGER update_billing_profiles_updated_at
    BEFORE UPDATE ON public.billing_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

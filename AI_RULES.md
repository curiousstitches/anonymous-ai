# AI Rules

## Tech Stack
- Next.js 15 with the App Router is the application framework.
- React 19 is used for all UI and interactive client components.
- TypeScript is required, with strict mode enabled.
- Tailwind CSS 3 is the primary styling system, with shared design tokens defined in the existing global styles.
- Routing, layouts, and route handlers live under `src/app`.
- Supabase powers authentication and server/client session access via `@supabase/ssr` and `@supabase/supabase-js`.
- Reusable UI building blocks live in `src/components` and `src/components/ui`.
- Forms use `react-hook-form`.
- Charts use `recharts`.
- Icons use `lucide-react` as the default icon library.

## Library Usage Rules
- **Routing and navigation:** Use Next.js App Router conventions. Use `next/link`, `next/navigation`, and route files in `src/app`. Do not add React Router.
- **Styling:** Use Tailwind utility classes for component styling. Keep shared tokens, resets, and global styles in `src/styles/*.css`. Do not introduce CSS-in-JS libraries.
- **UI components:** Reuse existing components from `src/components/ui` before creating new primitives. Add app-specific composed components in `src/components` or route-local `components/` folders.
- **Icons:** Use `lucide-react` for all new icons. Do not introduce a new icon library for new work.
- **Images:** Use `next/image` directly or the existing `src/components/ui/AppImage.tsx` wrapper for app images. If a remote image host is needed, add it to `image-hosts.config.mjs`.
- **Forms:** Use `react-hook-form` for forms with multiple fields, validation, or submission state. Keep form schemas and submit handlers close to the form component.
- **Notifications:** Use `sonner` for all new toast notifications. Only keep `react-hot-toast` in existing legacy surfaces unless you are fully migrating that surface.
- **Charts and dashboards:** Use `recharts` for visualizations instead of adding another charting library.
- **Backend and auth:** Use the existing Supabase helpers in `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`. Do not call Supabase directly with ad-hoc clients throughout the app.
- **Server-side integrations:** Put server-only logic, API integrations, and secret-dependent code in Next.js route handlers or server utilities under `src/app/api` and `src/lib`. Do not expose secrets in client components.

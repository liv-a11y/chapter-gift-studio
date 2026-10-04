<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public marketing routes use `SiteShell`; `/new`, `/approve`, and `/guest` render the focused shared demo component without the marketing shell, keeping product demos isolated while avoiding duplicated flow code.
- Keep the waitlist UI in the shared `WaitlistForm` component so public story routes can place the same privacy-safe signup without duplicating submission logic.
- Keep Lovable AI provider setup and run correlation in server-only modules, while client code imports only `*.functions.ts` wrappers, to protect credentials and preserve server boundaries.

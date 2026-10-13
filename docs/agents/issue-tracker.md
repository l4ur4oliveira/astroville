# Issue tracker: GitHub Issues

GitHub Issues is the single source of truth for specifications, implementation tickets, status, discussion, and dependencies. Use the `gh` CLI from this repository. Do not create parallel issue records under `.scratch/`.

## Conventions

- **Specification**: create a parent issue containing the spec. Use the `ready-for-agent` triage label when it is ready for implementation.
- **Implementation tickets**: create each ticket as a GitHub sub-issue of its specification issue. Use one issue per vertical slice and apply the appropriate triage label.
- **Dependencies**: use GitHub's native issue dependencies (`gh issue create --blocked-by <issue-number>`). Create issues in dependency order so blocker numbers are available.
- **Status**: use GitHub labels mapped in `triage-labels.md`; do not maintain a competing `Status:` field in local markdown.
- **Comments and history**: keep them in the relevant GitHub issue.
- **PRs as a triage surface**: no. _(Change this only if this repo decides to triage external PRs as requests.)_

## Common operations

- **Create an issue**: `gh issue create --title "..." --body "..."`.
- **Create a sub-issue**: `gh issue create --parent <parent-number> --title "..." --body "..."`.
- **Create a blocked issue**: add `--blocked-by <issue-number>`.
- **Read an issue**: `gh issue view <number> --json number,title,body,labels,comments,blockedBy,blocking`.
- **List issues**: `gh issue list --state open --json number,title,body,labels`.
- **Comment**: `gh issue comment <number> --body "..."`.
- **Apply or remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`.
- **Close**: `gh issue close <number> --comment "..."`.

GitHub's shared issue/PR number space means a bare `#42` can refer to either; use `gh issue view 42` or `gh pr view 42` to resolve it.

## Wayfinding operations

Used by `/wayfinder`:

- **Map**: one GitHub issue labelled `wayfinder:map` containing Notes, Decisions-so-far, and Fog.
- **Child ticket**: a GitHub sub-issue linked to the map; use a `wayfinder:<type>` label (`research`, `prototype`, `grilling`, or `task`).
- **Blocking**: native GitHub issue dependencies. A ticket is unblocked when every blocker is closed.
- **Claim**: assign the issue to the person driving it.
- **Resolve**: add the answer as an issue comment, close the issue, then update the map's Decisions-so-far with a context pointer.

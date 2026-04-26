---
name: Vue 3 Abren ERP Development
description: Patterns and guardrails for building the Abren ERP UI with Vue 3, TypeScript, TanStack Query/Table, and the current workboard-first UX architecture.
---

# Vue 3 Abren ERP Development Skill

## Core Rules

1. **Always** use Vue 3 Composition API with `<script setup lang="ts">`.
2. **Always** use strict TypeScript. Do not introduce `any`.
3. **Always** keep server state in TanStack Query via the shared composables. Do not duplicate domain data in Pinia.
4. **Always** preserve the 4-layer module architecture: Domain, Application, Infrastructure, UI.
5. **Always** use props-in/events-out component contracts.
6. **Always** prefer Abren-owned shared components from `@/shared/components/` and `@/shared/components/primitives/`.
7. **Do not reintroduce Fluent as a UI foundation**. New UI architecture must center Abren-owned composition and headless foundations.
8. **Never** import across module internals. Cross-module coordination should happen through explicit boundaries.
9. **Never** move business logic into `shared/`.
10. **Always** optimize UX around operational clarity, traceability, and action hierarchy.

## Product UX Doctrine

When building UI for this project, assume Abren is:

- a **workboard-first** ERP
- a **decision-and-execution workspace**, not a vanity dashboard
- a system where **traceability is a first-class feature**
- a product that favors **calm density** over decorative complexity

That means:

- home screens should prioritize approvals, exceptions, blockers, and next actions
- list screens should behave like workspaces for scanning and triage
- detail screens should behave like focus canvases for consequential work
- drawers should carry trace and supporting context
- destructive actions must be explicit and gated
- fake metrics and placeholder analytics should be avoided

## Structural Patterns

Every route should generally fit one of these surface types:

1. **Workboard**
   - Time-sensitive work, approvals, exceptions, alerts
2. **Workspace**
   - Dense list/filter/grid surface for scanning and triage
3. **Focus**
   - Single-record execution or review surface
4. **Setup**
   - Configuration and governance surface
5. **Quick Triage** (Workspace sub-pattern)
   - List-level audit preview via a docked `AppSidePane` beside the grid
   - Shows the timeline/trace for a selected row _without leaving the queue_
   - Uses `mode="docked"` to push the grid left; does NOT navigate away
   - Supplements but does not replace the Focus route

Prefer this grammar for transactional flows:

`Workspace -> Focus -> Trace Drawer -> Confirmed Action`

For high-volume review workflows, the extended grammar is:

`Workspace (+ Quick Triage pane) -> Focus -> Confirmed Action`

## Shared UI Expectations

Prefer shared page composition over one-off page markup. Reuse or introduce shared patterns such as:

- page headers (use `PageHeader` with a dynamic operational subtitle, not a static description)
- section wrappers
- toolbars
- empty states
- exception banners
- metric strips
- trace sections
- `AppSidePane` for filter drawers and docked trace panes (mode: `overlay` for filters, `docked` for trace)

Pages in different modules should feel like one operating system, not isolated demos.

### DataGrid Footer Contract

Every financial Workspace page **must** populate the `DataGrid` `#footer` slot:

```
Showing X of Y rows  •  Total: ETB X,XXX.XX  •  Selected: N
```

- Row count is always present
- Financial aggregate (sum of primary currency column) is always present
- Selection count appears only when `rowSelection` is active

### Bulk Action Bar Contract

When `selectedCount > 0` in a Workspace grid, a **floating action bar** must appear anchored to the bottom of the grid surface:

- State-advancing: `Approve Selected (N)`
- State-reversing: `Reject Selected (N)`
- Utility: `Export Selected`
- Uses `<Transition>` and dismisses when selection is cleared
- Never a modal — it is a floating bar so the user can see which rows are selected

### Smart Filter (Bucket Tab) Pattern

Do not expose raw backend statuses as a flat dropdown filter. Instead, group statuses into **actionable buckets** at the top of a Workspace:

- `ALL` — total count
- `NEEDS ATTENTION` — Rejected, Draft (requires user action)
- `IN REVIEW` — Submitted, Pending Approval
- `COMPLETED` — Authorized, Paid

Bucket tabs are computed from live data, not hardcoded. They drive the `statusFilter` ref which the grid's row filter reads.

## Data and Forms

- Queries should use the module adapter + mapper pattern through shared query composables.
- Mutations should use shared mutation helpers and invalidate/query-update deliberately.
- Forms should keep domain rules in schemas/composables and presentation in UI components.
- Loading, empty, error, and success states are part of the UX contract, not afterthoughts.

## Styling Guidance

- Use the design tokens in `src/assets/main.css`.
- Prefer semantic utility composition over ad hoc color choices.
- Keep accent color scarce and meaningful.
- Use spacing and surface contrast to create hierarchy before adding borders or shadows.
- Preserve readability of financial data with strong alignment and tabular numerals.

## What To Avoid

- generic admin-dashboard layouts
- decorative KPI cards without trustworthy data
- inconsistent action placement across modules
- raw vendor primitives inside business pages when a shared wrapper exists
- layout decisions that hide what needs attention now
- **inline cell editing in financial data grids** — editing amounts, dates, or statuses directly in a grid cell bypasses domain validation, state machine checks, and audit trail recording; all mutations must flow through the Focus Canvas or a sanctioned Drawer form; this is a financial control, not a UX limitation
- **tri-pane / master-detail layouts that render list + detail simultaneously on the same route** — this violates Sequential Progressive Disclosure and creates split-focus fatigue; the sanctioned pattern is the Quick Triage docked pane (trace only) + a separate Focus route for full editing
- fake or placeholder metrics — if data is not real, show an honest empty state

## Implementation Bias

When you have a choice, prefer:

- clear work prioritization over visual novelty
- truthful empty states over invented demo data
- reusable page architecture over isolated page styling
- Abren-specific UX language over vendor imitation

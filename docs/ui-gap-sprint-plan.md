# UI Gap Review and Sprint Plan

This document reviews the current UI state in `web/` and identifies the remaining gaps by user role, by reusable flow primitive, and by sprint.

It is based on the current repository state as of March 31, 2026.

## Current UI Surface

Implemented now:

- Public marketing and information pages:
  - `/`
  - `/about`
  - `/contact`
  - `/faq`
  - `/pricing`
  - `/blog`
  - `/blog/[slug]`
  - `/legal/[slug]`
  - `/locations/[county]`
  - `/locations/[county]/[city]`
- Public property discovery:
  - `/properties`
  - `/properties/[slug]`
  - `/search`
- Auth flows:
  - `/login`
  - `/register`
  - `/forgot-password`
  - `/reset-password`
  - `/verify-email`
- Protected shells:
  - `/dashboard`
  - `/dashboard/settings/security`
  - `/portal`
  - `/admin`
  - `/admin/settings/backend`
  - `/admin/system/health`

Implemented reusable UI primitives now:

- Public header/footer/page shell
- Property card, grid, filters, search bar, gallery
- Auth shell, login, register, forgot-password, reset-password forms
- Session list
- Backend switch card

Not implemented yet:

- Tenant task flows
- Landlord-agent operational flows
- Admin operational modules beyond backend control
- Moderator and support workspaces
- Notification center
- Inquiry and booking workflows
- Saved listings and compare flows
- CMS editing UI
- Listing create/edit/moderate UI

## Role-by-Role Gap Review

### 1. Guest / Public Visitor

Working now:

- Can browse marketing content
- Can search listings
- Can open property detail pages
- Can navigate SEO-safe public content pages

Missing core UI flows:

- Saved listings
- Compare listings
- Share listing
- Report listing
- Inquiry form
- Book viewing form
- WhatsApp CTA flow
- Agent / landlord public profile pages
- Neighborhood detail pages beyond placeholder landing shells
- Pagination controls on listing/search pages
- Skeleton loaders and public empty states beyond listing grid

Missing primitives:

- Listing action bar
- Sticky inquiry/viewing side panel
- Search result pagination
- Breadcrumbs
- Trust badges / verified state chips
- CTA blocks on public pages

### 2. Authenticated Viewer / Basic User

Working now:

- Can authenticate
- Can reset password
- Can manage active sessions
- Can access protected dashboard shell

Missing core UI flows:

- Personal dashboard overview
- Profile page
- Notification center
- Saved listings workspace
- Compare workspace
- Inquiry history
- Viewing history
- Alert preferences

Missing primitives:

- User nav / account menu
- Protected dashboard sidebar
- Empty-state cards for zero activity
- List/table primitives for user records like inquiries and favorites

### 3. Tenant

Working now:

- Same as authenticated viewer

Missing core UI flows:

- Saved listings dashboard
- Inquiry creation and conversation thread
- Viewing scheduling and status tracking
- Preferred locations and budget settings
- Property alerts subscription UI
- Application history and application details
- Profile completion flow

Missing primitives:

- Multi-step application flow shell
- Status timeline component
- Notification preference toggles
- Document upload dropzone for applications

### 4. Landlord / Agent / Property Manager

Working now:

- Can access protected `/portal` shell

Missing core UI flows:

- Portal overview
- Listing management table
- Create listing
- Edit listing
- Draft / publish / archive actions
- Media upload and ordering
- Lead / inquiry inbox
- Viewing request management
- Listing analytics
- Team management
- Profile / KYC-ready onboarding

Missing primitives:

- Data table with filters and bulk actions
- Listing editor form sections
- Media uploader with sortable gallery
- Moderation state badges
- Lead pipeline board or status list
- Analytics cards and chart wrappers

### 5. Moderator

Working now:

- Can enter admin shell if permissions allow

Missing core UI flows:

- Moderation dashboard
- Pending listing review queue
- Listing approval / rejection workflow
- Review and abuse report queue
- Moderation notes log
- Escalation flow

Missing primitives:

- Moderation queue table
- Side-by-side listing review pane
- Approval / reject modal
- Audit trail panel

### 6. Support

Working now:

- Can enter admin shell if permissions allow

Missing core UI flows:

- Support inbox
- Inquiry assignment and notes
- Viewing coordination flow
- Support tickets
- User assistance workflow

Missing primitives:

- Ticket thread layout
- Assignment dropdowns
- Internal note composer
- Status timeline / reminder widgets

### 7. Admin / Super Admin

Working now:

- Admin shell
- Backend switch page
- System health page

Missing core UI flows:

- Admin dashboard overview
- User management
- Role and permission management
- Listing moderation module
- Inquiries management
- Viewings management
- CMS management
- Blog management
- FAQ management
- Legal page management
- Location taxonomy management
- Amenities management
- Audit log viewer
- Activity feed
- Export center
- Settings areas beyond backend control

Missing primitives:

- Admin sidebar / nav
- Stats cards
- Charts
- Filterable admin tables
- Audit log diff panels
- Settings form sections
- Toasted success/failure mutation patterns for admin actions

## Flow Primitive Gap Review

These are the reusable building blocks still missing even before domain-specific screens:

### Navigation Primitives

- Protected app shell navigation for dashboard, portal, and admin
- User account dropdown
- Breadcrumbs
- Local tab navigation for settings, listings, moderation

### Data Display Primitives

- Table component pattern for admin and portal modules
- Pagination controls
- Sort headers
- Status chips
- Activity feed item component
- Metric/stat cards
- Chart wrappers

### Form Primitives

- Multi-section form layout
- Form field wrappers with help text and error state consistency
- Confirm dialogs for destructive or sensitive actions
- Drawer/modal pattern for detail editing
- Rich text editor surface for CMS/blog

### Workflow Primitives

- Status timeline
- Stepper / multi-step flow
- Empty state library
- Loading skeleton library
- File upload / media manager
- Review / moderation panel

### Messaging Primitives

- Notification list
- Conversation thread
- Internal note composer
- Toast strategy standardization

## Functional Gap Severity

### Critical

- No tenant product workflow beyond auth
- No landlord-agent product workflow beyond shell
- No admin operations beyond backend control
- No inquiry / booking UI
- No listing creation / editing UI
- No moderation UI

### High

- No saved / compare / report listing flows
- No notification center
- No user profile management
- No pagination controls on listing pages
- No CMS management UI
- No role-management UI

### Medium

- No breadcrumbs
- No analytics cards/charts in workspaces
- No review/trust UI
- No CTA conversion flows on property detail
- No agent / landlord public profile pages

## Recommended Sprint Sequence

The right sequencing is not by page count. It should be by reusable primitive first, then by role workflow.

## Sprint A: Protected App Shells and Navigation

Goal:

- Turn dashboard, portal, and admin from isolated pages into actual app workspaces.

Deliver:

- Shared protected layout primitives
- Section nav / sidebar
- User account menu
- Breadcrumb pattern
- Workspace empty states

File targets:

- `web/components/layout/`
- `web/components/navigation/`
- `web/app/dashboard/layout.tsx`
- `web/app/portal/layout.tsx`
- `web/app/admin/layout.tsx`
- `web/app/dashboard/page.tsx`
- `web/app/portal/page.tsx`
- `web/app/admin/page.tsx`

Exit criteria:

- Each protected area feels like a real application shell, not a placeholder page.

## Sprint B: Public Conversion Primitives

Goal:

- Close the biggest public flow gaps before building internal modules.

Deliver:

- Save listing
- Compare listing
- Report listing
- Share listing
- Inquiry CTA block
- Viewing CTA block
- Pagination controls for listings/search

File targets:

- `web/components/properties/PropertyActionBar.tsx`
- `web/components/properties/PropertyPagination.tsx`
- `web/app/saved/page.tsx`
- `web/app/compare/page.tsx`
- `web/app/api/internal/inquiries/*`
- `web/app/api/internal/favorites/*`
- `web/app/api/internal/comparisons/*`

Exit criteria:

- Public property detail and listing pages support meaningful user actions.

## Sprint C: Tenant Workspace

Goal:

- Build the first real end-user workspace after auth.

Deliver:

- Dashboard overview
- Saved listings
- Inquiry history
- Viewing history
- Alert preferences
- Profile basics

File targets:

- `web/app/dashboard/page.tsx`
- `web/app/dashboard/saved/page.tsx`
- `web/app/dashboard/inquiries/page.tsx`
- `web/app/dashboard/viewings/page.tsx`
- `web/app/dashboard/settings/profile/page.tsx`
- `web/app/dashboard/settings/alerts/page.tsx`
- `web/components/dashboard/`
- `web/modules/tenant/`

Exit criteria:

- A tenant can log in and complete meaningful repeat workflows.

## Sprint D: Inquiry and Viewing Workflow

Goal:

- Build the cross-role lead pipeline that connects public discovery to tenant and landlord operations.

Deliver:

- Inquiry form
- Viewing request form
- Inquiry status model in UI
- Viewing status model in UI
- Thread / notes primitives

File targets:

- `web/components/inquiries/`
- `web/components/viewings/`
- `web/app/api/internal/inquiries/*`
- `web/app/api/internal/viewings/*`
- `web/lib/core/contracts/inquiry.ts`
- `web/lib/core/contracts/viewing.ts`
- `web/lib/core/providers/*/inquiries.ts`
- `web/lib/core/providers/*/viewings.ts`

Exit criteria:

- Public user can submit inquiry/viewing, tenant can track it, landlord/support can later manage it.

## Sprint E: Landlord / Agent Portal

Goal:

- Turn `/portal` into a real operating workspace.

Deliver:

- Portal dashboard
- Listings table
- Create listing
- Edit listing
- Publish/archive actions
- Leads view
- Viewing management

File targets:

- `web/app/portal/page.tsx`
- `web/app/portal/listings/page.tsx`
- `web/app/portal/listings/new/page.tsx`
- `web/app/portal/listings/[id]/page.tsx`
- `web/app/portal/inquiries/page.tsx`
- `web/app/portal/viewings/page.tsx`
- `web/components/portal/`
- `web/modules/portal/`

Exit criteria:

- A landlord or agent can manage inventory and respond to demand signals.

## Sprint F: Listing Editor and Media Manager

Goal:

- Build the reusable create/edit primitive set that both landlord and admin tools will depend on.

Deliver:

- Listing editor sections
- Media uploader
- Gallery ordering
- Document upload
- Location and amenity selectors
- Moderation status display

File targets:

- `web/components/listing-editor/`
- `web/components/media/`
- `web/lib/core/sdk/media-client.ts`
- `web/app/api/internal/properties/*`

Exit criteria:

- Listing CRUD has a real usable UI primitive foundation.

## Sprint G: Admin Operations Core

Goal:

- Build the first serious admin modules after backend control.

Deliver:

- Admin dashboard overview
- User management
- Listing moderation queue
- Inquiry management
- Audit log viewer
- Activity feed

File targets:

- `web/app/admin/page.tsx`
- `web/app/admin/users/page.tsx`
- `web/app/admin/listings/page.tsx`
- `web/app/admin/inquiries/page.tsx`
- `web/app/admin/audit-logs/page.tsx`
- `web/app/admin/activity/page.tsx`
- `web/components/admin/tables/`
- `web/components/admin/charts/`

Exit criteria:

- Admin can operate the core platform, not just inspect backend mode.

## Sprint H: CMS and Content Management

Goal:

- Move public content from static-in-code into admin-managed workflows.

Deliver:

- Blog management
- FAQ management
- Legal page management
- Homepage section management
- SEO defaults management

File targets:

- `web/app/admin/content/*`
- `web/app/admin/blog/*`
- `web/app/admin/faqs/*`
- `web/app/admin/settings/legal/*`
- `web/components/editor/`
- `web/modules/cms/`

Exit criteria:

- Marketing and legal content become managed rather than hardcoded.

## Sprint I: Moderator and Support Workspaces

Goal:

- Split admin operational roles into dedicated workflow surfaces.

Deliver:

- Moderation review queue
- Review/report handling
- Support inbox
- Ticket threads
- Assignment and escalation flow

File targets:

- `web/app/admin/moderation/*`
- `web/app/admin/support/*`
- `web/components/moderation/`
- `web/components/support/`

Exit criteria:

- Moderator and support roles have clear, constrained operational flows.

## Sprint J: Notification Center and Cross-App Polish

Goal:

- Close the missing cross-role interaction layer.

Deliver:

- Notification center
- Read/unread state
- Notification preferences
- Consistent skeletons
- Consistent error/success toasts
- Empty-state library finalization

File targets:

- `web/app/dashboard/notifications/page.tsx`
- `web/app/portal/notifications/page.tsx`
- `web/components/notifications/`
- `web/components/empty-states/`
- `web/components/skeletons/`

Exit criteria:

- The app feels coherent across public, tenant, portal, and admin surfaces.

## Recommended Build Order

If only one implementation sequence is chosen, use this:

1. Sprint A: protected shells
2. Sprint B: public conversion primitives
3. Sprint D: inquiry and viewing workflow
4. Sprint C: tenant workspace
5. Sprint E: landlord / agent portal
6. Sprint F: listing editor and media manager
7. Sprint G: admin operations core
8. Sprint H: CMS management
9. Sprint I: moderator and support workspaces
10. Sprint J: notifications and polish

## Practical Conclusion

The current repo is strongest in:

- public content structure
- property discovery
- auth/security foundation
- backend/provider architecture
- admin backend control

The current repo is weakest in:

- all role-specific operational workflows
- reusable app-shell primitives
- action-oriented listing flows
- inquiry / viewing / moderation / CMS management UI

That means the next UI work should not start with another public page. It should start with workflow primitives and role workspaces.

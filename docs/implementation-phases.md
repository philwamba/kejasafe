# Kejasafe Implementation Phases

This document defines the recommended implementation sequence for the Kejasafe platform across the existing monorepo:

- `web/` for the Next.js application
- `api/` for the Laravel 13 API

The goal is to build a production-grade property, housing, tenant, landlord, and admin platform with dual backend support:

1. `prisma_neon` as the active backend
2. `laravel_api` as the active backend

The implementation order below is designed to reduce rework, preserve architectural clarity, and keep the frontend independent from backend-specific behavior.

## Guiding Principles

- Build the provider abstraction before building feature-heavy UI.
- Keep authentication cookie-based only.
- Keep backend-specific code out of React components.
- Treat the Next.js app as the unified web layer and domain orchestration layer.
- Keep Prisma and Laravel data contracts aligned from the start.
- Build auditability, health checks, moderation, and permissions as first-class concerns.
- Optimize for maintainability, security, and future backend source-of-truth transitions.

## Delivery Strategy

- Phase 0 through Phase 4 establish the foundation and architectural boundaries.
- Phase 5 through Phase 11 implement the main product domains.
- Phase 12 through Phase 15 complete operational hardening, testing, and deployment readiness.

## Phase 0: Discovery, Alignment, and Standards

### Objectives

- Confirm business scope and MVP vs phase-two boundaries.
- Lock the monorepo conventions for `web/` and `api/`.
- Define shared naming, DTO, status, and ID conventions.
- Establish engineering standards before writing major feature code.

### Deliverables

- Product scope matrix by module.
- Shared domain glossary.
- Status enum definitions for listings, inquiries, notifications, reviews, and backend modes.
- Coding standards for TypeScript, Laravel, testing, and API design.
- Initial docs structure under `docs/`.

### Implementation Notes

- Decide on UUID strategy for all primary business entities.
- Freeze public URL strategy for listings, locations, blog posts, and profile pages.
- Define shared DTO naming rules such as `PropertyCardDto`, `PropertyDetailDto`, `AdminDashboardDto`.
- Define how timestamps, money, booleans, and nullable values are represented across both backends.

## Phase 1: Monorepo Foundation and Package Baseline

### Objectives

- Install and configure the core stack cleanly.
- Create the folder structures required for domain modules and provider abstraction.
- Introduce foundational utilities without coupling them to product features.

### `web/` Deliverables

- Configure App Router structure with `src/` adoption if preferred.
- Add and configure:
  - `axios`
  - `zod`
  - `react-hook-form`
  - `@hookform/resolvers`
  - `@tanstack/react-query`
  - `prisma`
  - `@prisma/client`
  - `argon2`
  - `jose`
  - `date-fns`
  - `react-icons`
  - `recharts`
  - `sonner`
  - `react-dropzone`
  - `next-themes`
  - `framer-motion`
  - `pino`
- Configure Tailwind and shadcn/ui component foundation.
- Create base utility modules:
  - config
  - logger
  - env parsing
  - API error mapping
  - pagination helpers
  - query param parsing

### `api/` Deliverables

- Install and configure:
  - `laravel/sanctum`
  - `spatie/laravel-permission`
  - `spatie/laravel-activitylog`
  - `spatie/laravel-medialibrary`
  - `spatie/laravel-query-builder`
  - optional `spatie/laravel-data` if selected
- Set Laravel API versioning conventions under `/api/v1`.
- Establish modular domain folder structure.
- Configure Pint, Pest, and base test helpers.

### Exit Criteria

- Dependencies are installed cleanly.
- Foundational directory structures exist.
- Shared engineering conventions are documented.

## Phase 2: Core Domain Model and Schema Design

### Objectives

- Design and implement the primary schema in both Prisma and Laravel.
- Align table structure and business semantics across both backends.
- Avoid contract drift before services and UI are built.

### Core Tables and Models

- Identity and access:
  - `users`
  - `profiles`
  - `sessions`
  - `verification_tokens`
  - `password_reset_tokens`
  - `login_logs`
  - `roles`
  - `permissions`
- Platform:
  - `backend_settings`
  - `audit_logs`
  - `activity_logs`
  - `settings`
  - `notifications`
  - `notification_preferences`
- Geography and taxonomy:
  - `counties`
  - `cities`
  - `neighborhoods`
  - `property_types`
  - `amenities`
  - `tags`
- Property:
  - `properties`
  - `property_versions`
  - `property_locations`
  - `property_prices`
  - `property_images`
  - `property_documents`
  - `property_availability`
  - `property_nearby_places`
  - `property_amenities`
  - `property_tags`
  - `property_moderation_notes`
- User interaction:
  - `inquiries`
  - `inquiry_messages`
  - `viewing_requests`
  - `favorites`
  - `comparisons`
  - `reviews`
  - `review_reports`
- CMS and marketing:
  - `blog_posts`
  - `blog_categories`
  - `blog_tags`
  - `faqs`
  - `pages`
  - `banners`
  - `testimonials`
- Monetization-ready:
  - `plans`
  - `subscriptions`
  - `invoices`
  - `feature_payments`
- Support:
  - `support_tickets`
  - `support_ticket_messages`

### Deliverables

- Prisma schema with enums, indexes, relations, and soft-delete strategy.
- Laravel migrations and Eloquent model map.
- Shared status lifecycle docs for listings, inquiries, moderation, and notifications.

### Exit Criteria

- Prisma and Laravel schema plans are aligned.
- Migration order is defined.
- No unresolved ambiguity remains around core entity ownership.

## Phase 3: RBAC, Authorization, and Security Baseline

### Objectives

- Build real permission-based access control early.
- Secure both backend modes before exposing sensitive workflows.

### Deliverables

- Database-seeded roles:
  - `super_admin`
  - `admin`
  - `moderator`
  - `support`
  - `landlord`
  - `agent`
  - `tenant`
  - `viewer`
  - `property_manager`
  - `accountant`
- Database-seeded permission catalog.
- Authorization policies for:
  - user management
  - listing ownership
  - listing moderation
  - backend switching
  - settings management
  - report exports
- Middleware and guard utilities in both `web/` and `api/`.

### Security Controls

- Server-side permission evaluation only.
- No client-trusted roles or claims.
- CSRF strategy documented for both backend modes.
- Rate limiting rules for:
  - auth
  - inquiry creation
  - viewing booking
  - backend switching
  - support-sensitive endpoints

### Exit Criteria

- Sensitive routes cannot be accessed without policy enforcement.
- Role and permission data is seedable and testable.

## Phase 4: Cookie-Based Authentication and Session Management

### Objectives

- Implement a professional cookie-only auth system in both modes.
- Make auth consistent from the frontend perspective regardless of backend provider.

### Prisma Mode

- Email/password login.
- Secure password hashing with `argon2`.
- Opaque session IDs stored in secure `httpOnly` cookies.
- Session table with rotation and revocation support.
- Remember-me cookie strategy.
- Forgot password and reset flow.
- Email verification flow.
- Device and session management.
- Login logs and alert hooks.

### Laravel Mode

- Sanctum SPA cookie flow.
- CSRF cookie bootstrap endpoint.
- Session invalidation and logout-all support.
- Forgot password and email verification support.
- 2FA-ready architecture placeholders without premature implementation.

### Shared Deliverables

- Internal auth service contract in `web/`.
- Route protection middleware and server helpers.
- Role-based post-login redirect strategy.
- Session listing and session revocation UX.

### Exit Criteria

- Browser auth works with cookies only.
- No auth tokens are stored in `localStorage`.
- Session lifecycle is test-covered.

## Phase 5: Backend Provider Abstraction and Internal SDK

### Objectives

- Make the frontend independent from the active backend.
- Centralize all backend calls behind typed contracts and adapters.

### Required Design

- Shared provider contracts:
  - `AuthProvider`
  - `PropertyProvider`
  - `InquiryProvider`
  - `CmsProvider`
  - `AdminProvider`
  - `NotificationProvider`
  - `SystemProvider`
- Concrete provider implementations:
  - `prismaProvider`
  - `laravelApiProvider`
- Domain services:
  - `AuthService`
  - `PropertyService`
  - `InquiryService`
  - `AdminService`
  - `CmsService`
  - `SystemService`

### Axios Requirements

- Use `axios` as the shared HTTP client for internal API orchestration.
- Create configured clients for:
  - internal Next service calls
  - Laravel API forwarding
- Add interceptors for:
  - `withCredentials`
  - CSRF handling
  - normalized error mapping
  - request IDs
  - backend source metadata

### Deliverables

- Provider registry and backend resolver.
- DTO normalization layer.
- Error translation layer.
- Read fallback policy for non-sensitive requests.
- No React component imports a backend-specific adapter.

### Exit Criteria

- Components consume service-layer outputs only.
- Switching providers does not require component rewrites.

## Phase 6: Admin Backend Switch and System Health

### Objectives

- Build the dual-backend switch as a real operational capability, not a simple toggle.

### Deliverables

- `backend_settings` persistence model.
- System health checks for both providers:
  - database connectivity
  - auth readiness
  - queue health
  - media availability
  - latency
  - version metadata
- Admin backend settings page with:
  - current backend mode
  - dry-run validation
  - switch confirmation
  - rollback action
  - recent failure metrics
  - last successful sync timestamp
- Audit logging for every switch-related event.

### Rules

- Only `super_admin` can switch backend mode.
- Target backend must pass health checks before activation.
- Read-only fallback may be allowed.
- Sensitive writes must never silently switch providers mid-request.

### Exit Criteria

- Backend switching is safe, auditable, permissioned, and testable.

## Phase 7: Public Website and CMS Foundation

### Objectives

- Build the public-facing website and CMS-managed content system.
- Establish SEO foundations early because listings and location pages depend on them.

### Pages

- home
- about
- contact
- FAQ
- blog index
- blog detail
- pricing
- legal pages
- tenant help pages
- location landing pages

### CMS Modules

- homepage sections
- testimonials
- statistics blocks
- FAQ entries
- CTA blocks
- footer content
- contact information
- social links
- SEO defaults
- legal page content

### SEO Deliverables

- dynamic metadata
- sitemap
- robots
- canonical logic
- Open Graph
- schema markup for:
  - organization
  - FAQ
  - article
  - breadcrumbs

### Exit Criteria

- Marketing pages are editable from admin.
- SEO infrastructure is in place before listing volume grows.

## Phase 8: Property Listings and Search Domain

### Objectives

- Build the main discovery and listing experience.
- Support both marketplace and management use cases cleanly.

### Listing Features

- create
- edit
- draft
- review submission
- approve
- reject
- publish
- unpublish
- archive
- suspend
- feature/promote
- slug generation
- media ordering
- moderation notes
- version history
- availability data
- price history
- nearby places

### Search Features

- server-side filters
- pagination
- sorting
- canonical filter handling
- query param state
- search suggestions
- recent search intelligence
- saved search-ready architecture
- empty-state UX
- SEO-safe location pages

### UI Deliverables

- listing cards
- listing detail pages
- gallery
- compare listings
- save listings
- share listing
- report listing
- WhatsApp CTA
- inquiry CTA
- viewing CTA

### Exit Criteria

- Listings are searchable, publishable, and moderation-aware.
- The public listing experience is complete enough for real users.

## Phase 9: Tenant, Landlord, and Agent Workspaces

### Objectives

- Deliver the main authenticated workflows for marketplace participants.

### Tenant Module

- profile management
- saved listings
- compare list
- inquiry history
- viewing history
- application-ready architecture
- notifications
- alert preferences
- budget and location preferences

### Landlord and Agent Module

- onboarding profile
- KYC-ready profile fields
- listing management
- media/document uploads
- inquiry lead management
- viewing appointment management
- response workflow
- listing analytics
- billing-ready architecture
- team-ready account structure

### Exit Criteria

- Tenants and landlords can complete the core product journey without admin intervention.

## Phase 10: Inquiry, Viewing, Review, and Notification Workflows

### Objectives

- Implement the operational communication layer of the platform.

### Inquiry and Viewing

- inquiry form
- inquiry pipeline statuses
- duplicate detection
- spam protection
- assignment workflow
- notes
- reminders
- viewing request scheduling
- email confirmations
- escalation paths

### Reviews and Trust

- property reviews
- landlord reviews
- review moderation queue
- abuse reporting
- trust badges
- verified landlord badge
- verified listing badge

### Notification System

- in-app notifications
- email notification triggers
- unread/read states
- notification preferences
- digest-ready architecture
- SMS abstraction placeholder

### Exit Criteria

- Operational communication and trust flows are live and moderated.

## Phase 11: Admin Operations and Moderation Suite

### Objectives

- Complete the internal operating system of the platform.

### Admin Modules

- dashboard analytics
- user management
- role management
- permission management
- property moderation
- inquiries management
- viewing management
- blog management
- FAQ management
- location management
- amenities management
- testimonial management
- banners
- settings
- support tickets
- reports and export center
- audit logs
- activity feed

### Analytics

- total users
- active landlords
- active tenants
- total listings
- published listings
- pending listings
- inquiry count
- booking count
- backend mode
- backend health summary
- moderation alerts
- recent activities

### Exit Criteria

- The admin panel is sufficient for live operations and moderation.

## Phase 12: Media, Billing-Ready Architecture, and Integrations

### Objectives

- Harden platform capabilities that often cause later architectural debt.

### Media

- S3-compatible upload strategy or equivalent
- image validation
- alt text
- cover image selection
- drag-and-drop ordering
- responsive images
- document validation
- soft delete references

### Monetization Readiness

- subscription plans
- featured listing flow
- invoices
- receipts
- manual payment review architecture
- gateway abstraction

### Integrations

- mail provider hooks
- queue notifications
- webhook-ready verification pattern
- search-engine-ready abstraction for Meilisearch or Typesense later

### Exit Criteria

- Media and billing foundations are stable enough for controlled rollout.

## Phase 13: Auditability, Logging, Compliance, and Retention

### Objectives

- Complete the compliance and operational traceability layer.

### Deliverables

- audit logs for sensitive actions
- activity stream for operational events
- login logs
- backend switch logs
- moderation logs
- listing history tracking
- export logs
- support action logs
- IP and user-agent capture where appropriate
- retention notes and cleanup strategy

### Exit Criteria

- Sensitive platform actions are traceable and attributable.

## Phase 14: Testing, Quality Gates, and Release Validation

### Objectives

- Build confidence in the platform through layered testing.

### `web/` Tests

- unit tests for:
  - provider registry
  - DTO normalization
  - validation schemas
  - RBAC helpers
  - backend switch logic
- integration tests for:
  - auth flows
  - listing CRUD services
  - inquiry workflows
  - admin settings mutations
- Playwright tests for:
  - registration and login
  - listing search
  - save/favorite
  - create inquiry
  - landlord listing creation
  - admin moderation
  - backend switching

### `api/` Tests

- Pest feature tests for:
  - Sanctum auth flow
  - permissions and policies
  - property CRUD
  - moderation transitions
  - inquiry workflows
  - admin setting changes
- Unit tests for services, policy logic, and value mapping.

### Exit Criteria

- Quality gates exist in CI.
- High-risk workflows are covered before production launch.

## Phase 15: Deployment, Operations, and Handover

### Objectives

- Prepare the platform for deployment and supportable operations.

### Deliverables

- environment variable documentation
- migration runbook
- seeding runbook
- queue worker setup
- cron and scheduler requirements
- health endpoints
- structured logs
- error monitoring hooks
- docker-ready notes
- CI/CD command list
- admin handover notes
- rollback procedures

### Production Readiness Checklist

- production env vars are defined
- secure cookies are configured correctly per domain
- database backups are enabled
- queue workers are supervised
- storage and media configuration is verified
- health checks are monitored
- audit logs are retained appropriately
- backend switch process is documented for administrators

### Exit Criteria

- The system can be deployed, operated, monitored, and handed over cleanly.

## Suggested Execution Order Summary

1. Phase 0: discovery and standards
2. Phase 1: package baseline and folder structure
3. Phase 2: schema and migrations
4. Phase 3: RBAC and security baseline
5. Phase 4: cookie auth and sessions
6. Phase 5: provider abstraction and internal SDK
7. Phase 6: backend switch and health
8. Phase 7: CMS and marketing pages
9. Phase 8: property listing and search
10. Phase 9: tenant and landlord workspaces
11. Phase 10: inquiries, viewings, reviews, notifications
12. Phase 11: admin operations
13. Phase 12: media, billing-ready architecture, integrations
14. Phase 13: auditability and compliance
15. Phase 14: testing and release validation
16. Phase 15: deployment and handover

## Recommended Immediate Next Steps

1. Implement Phase 1 foundation work in both `web/` and `api/`.
2. Draft the Prisma schema and matching Laravel migration plan from Phase 2.
3. Implement the RBAC seeders and permission map from Phase 3.
4. Build the cookie-auth foundation and session tables from Phase 4.
5. Build the provider contracts and backend registry from Phase 5 before feature-heavy pages.

## Notes for This Repo

- The current repo already has a clean separation between `web/` and `api/`.
- The Next.js app is still light enough to adopt the service-layer and provider pattern without painful refactors.
- The Laravel app is still close to skeleton state, which makes this the right time to introduce modular domain organization and package choices deliberately.

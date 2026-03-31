# Kejasafe Sprint Roadmap

This roadmap converts the remaining implementation phases into concrete execution sprints based on the current repository state.

Current repo baseline:

- `web/` has provider architecture, auth routes, shared types, route protection, and protected shells.
- `api/` has core schema scaffolding, RBAC/auth seed scaffolding, and working auth route/service boundaries.
- Public product modules, admin operations, listings, CMS, testing, and deployment hardening are still incomplete.

## Sprint Planning Rules

- Complete dependency installation and schema verification before building heavy product modules.
- Do not add backend-specific calls in React components.
- Build domain by domain through the provider layer.
- Keep Prisma mode and Laravel mode contract-compatible.
- Every sprint should end with runnable verification, not only file creation.

## Sprint 1: Environment, Dependency, and Schema Verification

### Goal

Stabilize the repo so the current foundation actually installs, builds, and migrates cleanly.

### `web/` File Targets

- [package.json](/Users/filwillian/Projects/Laravel/kejasafe/web/package.json)
- [pnpm-lock.yaml](/Users/filwillian/Projects/Laravel/kejasafe/web/pnpm-lock.yaml)
- [.env.example](/Users/filwillian/Projects/Laravel/kejasafe/web/.env.example)
- [prisma/schema.prisma](/Users/filwillian/Projects/Laravel/kejasafe/web/prisma/schema.prisma)
- [lib/config/env.ts](/Users/filwillian/Projects/Laravel/kejasafe/web/lib/config/env.ts)

### `api/` File Targets

- [composer.json](/Users/filwillian/Projects/Laravel/kejasafe/api/composer.json)
- [.env.example](/Users/filwillian/Projects/Laravel/kejasafe/api/.env.example)
- [database/migrations/0001_01_01_000000_create_users_table.php](/Users/filwillian/Projects/Laravel/kejasafe/api/database/migrations/0001_01_01_000000_create_users_table.php)
- [database/migrations/2026_03_31_190000_create_profiles_backend_settings_and_logs_tables.php](/Users/filwillian/Projects/Laravel/kejasafe/api/database/migrations/2026_03_31_190000_create_profiles_backend_settings_and_logs_tables.php)
- [database/migrations/2026_03_31_190100_create_location_taxonomy_tables.php](/Users/filwillian/Projects/Laravel/kejasafe/api/database/migrations/2026_03_31_190100_create_location_taxonomy_tables.php)
- [database/migrations/2026_03_31_190200_create_properties_and_engagement_tables.php](/Users/filwillian/Projects/Laravel/kejasafe/api/database/migrations/2026_03_31_190200_create_properties_and_engagement_tables.php)
- [database/migrations/2026_03_31_190300_create_rbac_and_auth_support_tables.php](/Users/filwillian/Projects/Laravel/kejasafe/api/database/migrations/2026_03_31_190300_create_rbac_and_auth_support_tables.php)

### Implementation Order

1. Install missing `web` dependencies and regenerate the lockfile.
2. Run Prisma generate and Prisma validation.
3. Run Laravel composer install or update and ensure package discovery is clean.
4. Run Laravel migrations and seeders on a clean database.
5. Fix any schema drift between Prisma and Laravel before moving on.

### Exit Criteria

- `web` typechecks after dependency install.
- Prisma schema validates.
- Laravel migrations and seeders run successfully.
- Both apps boot without config errors.

## Sprint 2: Shared Contracts and Domain Utility Completion

### Goal

Finish the common infrastructure that product modules will rely on.

### `web/` File Targets

- [lib/shared/types/index.ts](/Users/filwillian/Projects/Laravel/kejasafe/web/lib/shared/types/index.ts)
- [lib/shared/types/property.ts](/Users/filwillian/Projects/Laravel/kejasafe/web/lib/shared/types/property.ts)
- [lib/shared/types/system.ts](/Users/filwillian/Projects/Laravel/kejasafe/web/lib/shared/types/system.ts)
- [lib/core/http/axios.ts](/Users/filwillian/Projects/Laravel/kejasafe/web/lib/core/http/axios.ts)
- [lib/core/http/response.ts](/Users/filwillian/Projects/Laravel/kejasafe/web/lib/core/http/response.ts)
- `web/lib/core/logger.ts`
- `web/lib/core/pagination.ts`
- `web/lib/core/query-state.ts`
- `web/lib/core/errors.ts`

### `api/` File Targets

- `api/app/Http/Resources/`
- `api/app/Http/Requests/`
- `api/app/Domain/*/Data/`
- `api/app/Domain/*/Policies/`

### Implementation Order

1. Add common logger and error helpers.
2. Introduce shared list/pagination response contracts.
3. Introduce normalized error mapping between Prisma and Laravel providers.
4. Add Laravel request/resource conventions for future modules.

### Exit Criteria

- Shared typing is centralized and reused consistently.
- Provider interfaces are stable enough for property and admin modules.

## Sprint 3: Auth UI Completion

### Goal

Turn the implemented auth API into usable product flows.

### `web/` File Targets

- [app/(auth)/login/page.tsx](/Users/filwillian/Projects/Laravel/kejasafe/web/app/(auth)/login/page.tsx)
- [app/(auth)/register/page.tsx](/Users/filwillian/Projects/Laravel/kejasafe/web/app/(auth)/register/page.tsx)
- `web/app/(auth)/forgot-password/page.tsx`
- `web/app/(auth)/reset-password/page.tsx`
- `web/components/auth/LoginForm.tsx`
- `web/components/auth/RegisterForm.tsx`
- `web/components/auth/ForgotPasswordForm.tsx`
- `web/components/auth/ResetPasswordForm.tsx`
- [lib/core/sdk/auth-client.ts](/Users/filwillian/Projects/Laravel/kejasafe/web/lib/core/sdk/auth-client.ts)

### `api/` File Targets

- [app/Domain/Auth/Services/AuthService.php](/Users/filwillian/Projects/Laravel/kejasafe/api/app/Domain/Auth/Services/AuthService.php)
- [app/Http/Controllers/Api/V1/Auth/AuthController.php](/Users/filwillian/Projects/Laravel/kejasafe/api/app/Http/Controllers/Api/V1/Auth/AuthController.php)
- `api/app/Notifications/Auth/ResetPasswordNotification.php`
- `api/app/Notifications/Auth/VerifyEmailNotification.php`

### Implementation Order

1. Build login and register forms with React Hook Form + Zod.
2. Add forgot-password and reset-password pages.
3. Wire success/error handling and redirect flows.
4. Add Laravel mail notifications and Prisma-side email abstraction hook.

### Exit Criteria

- Users can register, log in, log out, request reset, and reset password from the UI.
- Both providers work through the same internal Next auth API.

## Sprint 4: Session Management, Email Verification, and Auth Hardening

### Goal

Complete the missing high-value auth and account controls.

### `web/` File Targets

- `web/app/dashboard/settings/security/page.tsx`
- `web/components/auth/SessionList.tsx`
- [app/api/internal/auth/sessions/route.ts](/Users/filwillian/Projects/Laravel/kejasafe/web/app/api/internal/auth/sessions/route.ts)
- [app/api/internal/auth/sessions/[id]/route.ts](/Users/filwillian/Projects/Laravel/kejasafe/web/app/api/internal/auth/sessions/[id]/route.ts)
- `web/app/(auth)/verify-email/page.tsx`

### `api/` File Targets

- [app/Domain/Auth/Services/AuthService.php](/Users/filwillian/Projects/Laravel/kejasafe/api/app/Domain/Auth/Services/AuthService.php)
- [app/Models/VerificationToken.php](/Users/filwillian/Projects/Laravel/kejasafe/api/app/Models/VerificationToken.php)
- `api/routes/api.php`

### Implementation Order

1. Add session list and revoke-session UI.
2. Add logout-all flow.
3. Add email verification issue and consume flow.
4. Add account status and security-event logging.

### Exit Criteria

- Session/device management is usable.
- Email verification architecture is active in both modes.

## Sprint 5: Property Provider Implementation

### Goal

Move beyond auth and implement the first real business domain through the provider layer.

### `web/` File Targets

- [lib/core/contracts/property.ts](/Users/filwillian/Projects/Laravel/kejasafe/web/lib/core/contracts/property.ts)
- [lib/core/providers/prisma/index.ts](/Users/filwillian/Projects/Laravel/kejasafe/web/lib/core/providers/prisma/index.ts)
- [lib/core/providers/laravel/index.ts](/Users/filwillian/Projects/Laravel/kejasafe/web/lib/core/providers/laravel/index.ts)
- `web/lib/core/providers/prisma/properties.ts`
- `web/lib/core/providers/laravel/properties.ts`
- `web/lib/core/services/property-service.ts`
- `web/app/api/internal/properties/route.ts`
- `web/app/api/internal/properties/[slug]/route.ts`

### `api/` File Targets

- `api/app/Http/Controllers/Api/V1/Properties/PropertyController.php`
- `api/app/Http/Resources/Property/PropertyCardResource.php`
- `api/app/Http/Resources/Property/PropertyDetailResource.php`
- `api/app/Http/Requests/Property/ListPropertiesRequest.php`
- `api/app/Domain/Properties/Queries/PropertyListQuery.php`
- `api/app/Domain/Properties/Queries/PropertyDetailQuery.php`
- `api/routes/api.php`

### Implementation Order

1. Implement Prisma property list and detail provider methods.
2. Implement Laravel property list and detail API with normalized output.
3. Add internal Next property API routes.
4. Add DTO parity checks between both providers.

### Exit Criteria

- Property list and property detail can be loaded through either backend mode.

## Sprint 6: Public Listings and Search UI

### Goal

Build the first real public product experience.

### `web/` File Targets

- `web/app/properties/page.tsx`
- `web/app/properties/[slug]/page.tsx`
- `web/app/search/page.tsx`
- `web/components/properties/PropertyCard.tsx`
- `web/components/properties/PropertyGrid.tsx`
- `web/components/properties/PropertyFilters.tsx`
- `web/components/properties/PropertyGallery.tsx`
- `web/components/properties/PropertySearchBar.tsx`
- `web/modules/properties/`

### Supporting Files

- `web/lib/core/sdk/property-client.ts`
- `web/lib/core/query-state.ts`
- `web/lib/shared/types/property.ts`

### Implementation Order

1. Build property grid and filter UI.
2. Build property detail page.
3. Add query-param search state and pagination.
4. Add empty states, loading states, and canonical metadata.

### Exit Criteria

- Public users can search listings and open detail pages.

## Sprint 7: CMS, Marketing Pages, and SEO Foundation

### Goal

Build the editable public content system and SEO surface.

### `web/` File Targets

- `web/app/about/page.tsx`
- `web/app/contact/page.tsx`
- `web/app/faq/page.tsx`
- `web/app/pricing/page.tsx`
- `web/app/legal/privacy/page.tsx`
- `web/app/legal/terms/page.tsx`
- `web/app/legal/cookies/page.tsx`
- `web/app/blog/page.tsx`
- `web/app/blog/[slug]/page.tsx`
- `web/app/locations/[county]/page.tsx`
- `web/app/locations/[county]/[city]/page.tsx`
- `web/components/cms/`
- `web/modules/cms/`
- `web/app/sitemap.ts`
- `web/app/robots.ts`

### `api/` File Targets

- `api/app/Http/Controllers/Api/V1/Cms/PageController.php`
- `api/app/Http/Controllers/Api/V1/Cms/FaqController.php`
- `api/app/Http/Controllers/Api/V1/Blog/BlogPostController.php`
- `api/app/Models/Page.php`
- `api/app/Models/Faq.php`
- `api/app/Models/BlogPost.php`
- matching migrations for missing CMS entities

### Exit Criteria

- Public content pages exist.
- Core SEO plumbing is active.
- CMS entities are queryable from both providers.

## Sprint 8: Admin Backend Switch and System Health

### Goal

Deliver the dual-backend operational controls.

### `web/` File Targets

- `web/app/admin/settings/backend/page.tsx`
- `web/app/admin/system/health/page.tsx`
- `web/components/admin/backend/BackendModeCard.tsx`
- `web/components/admin/backend/BackendHealthPanel.tsx`
- `web/lib/core/services/system-service.ts`
- `web/lib/core/providers/prisma/system.ts`
- `web/lib/core/providers/laravel/system.ts`
- `web/app/api/internal/admin/backend/switch/route.ts`
- `web/app/api/internal/system/health/route.ts`

### `api/` File Targets

- `api/app/Http/Controllers/Api/V1/Admin/BackendController.php`
- `api/app/Domain/System/Services/BackendSwitchService.php`
- `api/app/Domain/System/Services/HealthCheckService.php`
- `api/routes/api.php`

### Implementation Order

1. Implement read-only health and backend status.
2. Implement switch validation and dry-run.
3. Implement audited switch mutation.
4. Add rollback action and failure metrics display.

### Exit Criteria

- Super admins can inspect and switch backend mode safely.

## Sprint 9: Landlord and Agent Portal

### Goal

Turn the protected portal shell into an actual listing-management workspace.

### `web/` File Targets

- `web/app/portal/listings/page.tsx`
- `web/app/portal/listings/new/page.tsx`
- `web/app/portal/listings/[id]/page.tsx`
- `web/app/portal/inquiries/page.tsx`
- `web/app/portal/viewings/page.tsx`
- `web/components/portal/`
- `web/modules/portal/`

### `api/` File Targets

- `api/app/Http/Controllers/Api/V1/Portal/PortalPropertyController.php`
- `api/app/Http/Controllers/Api/V1/Portal/PortalInquiryController.php`
- `api/app/Http/Requests/Property/CreatePropertyRequest.php`
- `api/app/Http/Requests/Property/UpdatePropertyRequest.php`
- `api/app/Domain/Properties/Actions/`

### Exit Criteria

- Landlords and agents can create and manage listings and view leads.

## Sprint 10: Tenant Workspace

### Goal

Build the tenant-facing authenticated product features.

### `web/` File Targets

- `web/app/dashboard/saved/page.tsx`
- `web/app/dashboard/inquiries/page.tsx`
- `web/app/dashboard/viewings/page.tsx`
- `web/app/dashboard/notifications/page.tsx`
- `web/app/dashboard/settings/page.tsx`
- `web/components/dashboard/`
- `web/modules/dashboard/`

### `api/` File Targets

- `api/app/Http/Controllers/Api/V1/Me/FavoriteController.php`
- `api/app/Http/Controllers/Api/V1/Me/InquiryController.php`
- `api/app/Http/Controllers/Api/V1/Me/ViewingController.php`
- `api/app/Http/Controllers/Api/V1/Me/NotificationController.php`

### Exit Criteria

- Tenants can manage favorites, inquiries, viewings, and account settings.

## Sprint 11: Inquiries, Viewings, and Notification Engine

### Goal

Build the operational communication workflow.

### `web/` File Targets

- `web/components/inquiries/InquiryForm.tsx`
- `web/components/viewings/ViewingRequestForm.tsx`
- `web/components/notifications/NotificationCenter.tsx`
- `web/lib/core/services/inquiry-service.ts`
- `web/lib/core/services/notification-service.ts`

### `api/` File Targets

- `api/app/Models/Inquiry.php`
- `api/app/Models/InquiryMessage.php`
- `api/app/Models/ViewingRequest.php`
- `api/app/Models/Notification.php`
- `api/app/Domain/Inquiries/`
- `api/app/Domain/Viewings/`
- `api/app/Domain/Notifications/`
- missing migrations for notification entities if not yet present

### Exit Criteria

- Inquiry and viewing workflows are live.
- In-app notifications are functioning.

## Sprint 12: Admin Operations and Moderation

### Goal

Build the real admin console modules.

### `web/` File Targets

- `web/app/admin/users/page.tsx`
- `web/app/admin/roles/page.tsx`
- `web/app/admin/listings/page.tsx`
- `web/app/admin/moderation/page.tsx`
- `web/app/admin/inquiries/page.tsx`
- `web/app/admin/viewings/page.tsx`
- `web/app/admin/settings/page.tsx`
- `web/app/admin/audit-logs/page.tsx`
- `web/app/admin/activity/page.tsx`

### `api/` File Targets

- `api/app/Http/Controllers/Api/V1/Admin/UserController.php`
- `api/app/Http/Controllers/Api/V1/Admin/RoleController.php`
- `api/app/Http/Controllers/Api/V1/Admin/ListingModerationController.php`
- `api/app/Http/Controllers/Api/V1/Admin/AuditLogController.php`
- `api/app/Domain/Admin/`

### Exit Criteria

- Admins can operate users, roles, moderation, and settings.

## Sprint 13: Media and Documents

### Goal

Build production-appropriate media workflows.

### `web/` File Targets

- `web/components/uploads/`
- `web/lib/core/services/media-service.ts`
- `web/modules/uploads/`

### `api/` File Targets

- media-related package config
- property media controllers
- document validation requests
- queue jobs for media processing

### Exit Criteria

- Image and document uploads work with validation and ordering.

## Sprint 14: Testing and CI

### Goal

Add verification coverage to the app you have built.

### `web/` File Targets

- `web/tests/unit/`
- `web/tests/integration/`
- `web/tests/e2e/`
- `web/playwright.config.ts`
- `web/vitest.config.ts`

### `api/` File Targets

- `api/tests/Feature/Auth/`
- `api/tests/Feature/Properties/`
- `api/tests/Feature/Admin/`
- `api/tests/Unit/Domain/`

### Exit Criteria

- Auth, property, moderation, and backend-switch flows are covered.

## Sprint 15: Deployment, Monitoring, and Handover

### Goal

Make the platform operationally ready.

### File Targets

- `README.md`
- `docs/implementation-phases.md`
- `docs/sprint-roadmap.md`
- `docs/deployment.md`
- `docs/admin-handover.md`
- CI workflow files
- Docker files if used

### Exit Criteria

- The app can be deployed, monitored, and handed over.

## Recommended Immediate Sprint Sequence

1. Sprint 1: environment and schema verification
2. Sprint 2: shared contracts and utilities
3. Sprint 3: auth UI completion
4. Sprint 4: auth hardening
5. Sprint 5: property provider implementation
6. Sprint 6: listings and search UI
7. Sprint 8: backend switch and health
8. Sprint 9 and 10: landlord/agent portal and tenant workspace
9. Sprint 11 and 12: communications and admin ops
10. Sprint 13 to 15: media, testing, deployment

## Notes

- Do not start Sprint 5 product modules until Sprint 1 verification is complete.
- Do not build admin backend switching UI before the health and service layer for both providers exists.
- Use the provider layer for every new domain module from this point onward.

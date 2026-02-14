# Plan: Core Implementation

## Phase 1: Database & Security (Supabase)
- [x] Create `init.sql` migration with Extensions and `brincareducando` Schema Setup.
- [x] Create `auth_trigger.sql` for automatic user profile creation in `brincareducando.usuarios`.
- [x] Create `tables.sql` with core tables in `brincareducando` schema.
- [x] Apply RLS policies to all tables in `brincareducando`.
- [x] Setup Storage Buckets and policies.

## Phase 2: Frontend Auth Integration
- [x] Integrate `app_id: 'brincareducando'` into `AuthForm.tsx`.
- [x] Implement user session verification in protected layouts.
- [x] Configure `middleware.ts` for route protection.
- [ ] Test Signup/Login flow with isolation check.

## Phase 3: Profile & Data Management
- [ ] Implement `useProfile` and `useChildren` hooks.
- [ ] Create "Create Child" form and validation.
- [ ] Verify data synchronization between Auth and Database.

## Phase 4: Content Data Hookup
- [ ] Seed dummy stories and activities for testing.
- [ ] Create basic listing pages for Stories and Activities.

## Phase 5: Email & Edge Functions (SMTP Router)
- [x] Create a Supabase Edge Function `smtp-router`.
- [ ] Implement isolation logic:
    - **Verify `app_id`**: Only process emails if the user's metadata is `brincareducando`.
- [ ] Setup `nodemailer` with Hostinger configurations (as per user snippet).
- [ ] Enable **Auth Hook (Custom Email)** in Supabase Dash:
    - Point to the `smtp-router` function to handle: `confirm_signup`, `reset_password`, `magic_link`.
- [ ] Create a "Welcome" trigger using a Database Webhook on `brincareducando.usuarios`.

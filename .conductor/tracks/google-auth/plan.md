# Plan: Google OAuth Integration

## Phase 1: Supabase Configuration (Manual)
- [ ] Enable Google Provider in Supabase Dashboard.
- [ ] Configure Client ID and Client Secret.
- [ ] Set Authorized Redirect URI: `https://[PROJECT_REF].supabase.co/auth/v1/callback`.
- [ ] **Branding**: Fill "App Name" (Brincar Educando) and "Logo" in the OAuth Consent Screen.
- [ ] **Verification**: Submit for verification to try and hide the Supabase domain (optional/long-term).

## Phase 2: Database Layer
- [ ] Create a migration to update `handle_new_user` trigger or add a manual profile initialization function.
- [ ] Ensure `raw_user_meta_data` is updated with `app_id: 'brincareducando'` for Google users if missing.

## Phase 3: Frontend Implementation
- [x] Update `AuthForm.tsx` to call `signInWithOAuth` and add colored branding.
- [x] Update `app/auth/callback/route.ts` to handle metadata synchronization and profile ensuring.
- [ ] Test the full loop.

## Phase 4: Verification
- [ ] Verify profile creation in `brincareducando.usuarios` after Google login.
- [ ] Verify that existing email users can "link" their account by logging in with the same Google email.

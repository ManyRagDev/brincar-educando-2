# Spec: Google OAuth Integration

## Objective
Enable users to sign in and sign up using their Google accounts while maintaining the cross-app isolation strategy (`app_id` branding) and ensuring consistent profile creation in the `brincareducando` schema.

## Requirements

### 1. OAuth Flow
- Trigger Google OAuth flow from the `AuthForm`.
- Handle the callback in `/auth/callback`.
- **Identity Linkage**: Ensure that signing in with Google correctly identifies the user.

### 2. App Isolation (Branding)
- Google users must be tagged with `app_id: 'brincareducando'` if they are registering through this app.
- If a user exists but belongs to another app (ManyLabs network), we must decide whether to:
    a) Automatically add the `brincareducando` metadata and profile.
    b) Show a confirmation (similar to the existing email unified choice).
    *Decision for MVP*: For OAuth, we will automatically ensure the profile exists upon first successful login at our callback, provided the user is not explicitly blocked.

### 3. Branding & Custom Domains
- **Challenge**: By default, Google shows the Supabase domain (`*.supabase.co`) on the consent screen.
- **Solution A (Low Cost)**: Complete the "OAuth Consent Screen" in Google Cloud with App Name and Logo. Submit for verification.
- **Solution B (Premium)**: Use a Supabase Custom Domain (requires Pro plan). This replaces the domain on the consent screen.
*Decision for MVP*: Solution A. We will configure the branding on Google Console.

### 4. Profile Persistence
- Ensure the `brincareducando.usuarios` profile is created for Google users.
- Since standard triggers might fail due to missing `app_id` in initial OAuth metadata, the `auth/callback` or a dedicated DB function must handle this.

## Success Criteria
- User clicks "Continuar com Google".
- User is redirected back and successfully logged in.
- A profile in `brincareducando.usuarios` is created automatically.
- User is redirected to the `/dashboard`.

# Spec: Core Implementation (Auth & DB)

## Objective
Implement a robust authentication system and database schema in Supabase to support the "Brincar Educando" platform features (Profiles, Children, Stories, History, and Milestones).

## Requirements

### 1. Authentication
- Integration with Supabase Auth (Email/Password).
- Automatic profile creation upon signup via Postgres Trigger.
- **Multi-App Isolation**: 
    - The `auth.users` table is shared. We will use `raw_user_meta_data ->> 'app_id'` to distinguish users.
    - The trigger will only create a profile in `brincareducando.usuarios` if the `app_id` matches.
    - Application routes will check for the existence of a profile in the `brincareducando` schema.
- Role-based Access Control (RBAC) with `user` and `admin` roles, stored within the `brincareducando.user_roles` table.

### 2. Database Schema (PostgreSQL)
The schema will follow the legacy structure but refined for the new architecture, residing EXCLUSIVELY in the `brincareducando` schema:
- `brincareducando.usuarios`: Profile data for caregivers.
- `brincareducando.criancas`: Profiles for children linked to caregivers.
- `brincareducando.historias`: Content metadata for "BrinContos".
- `brincareducando.historico`: Tracking of reading/audio progress and favorites.
- `brincareducando.atividades`: Repository of educational activities.

> [!IMPORTANT]
> Under no circumstances should tables be created in the `public` schema. 

### 3. Security
- Enable RLS (Row Level Security) on all tables.
- Specific policies to ensure users only see their own data and children profiles.
- Admins have read/write access to content tables (`historias`, `atividades`).

### 4. Storage
- Setup buckets for `historias-capas` and `historias-audio`.
- RLS policies for storage access.

## Success Criteria
- User can sign up and a record is automatically created in `usuarios`.
- User can login and access their private dashboard.
- Authenticated user can create and manage multiple child profiles.
- Content is only editable by admins but viewable by all authenticated users.

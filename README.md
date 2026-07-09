# CSC 413 Report Library — DELSU

A small web platform where CSC 413 students (Computer Science and Computer
Science Education) can read and download every group's pervasive-system
report in one place, and where you, as admin, can upload and manage them.

Built with React + Vite, using Supabase for the file storage, database, and
admin login, and meant to be deployed for free on Netlify.

---

## 1. What you're getting

- **Public site (`/`)** — anyone with the link can search, filter (by
  Computer Science / Computer Science Education), and download reports.
  No login required for students.
- **Admin login (`/admin/login`)** — you sign in with an email and password.
- **Admin dashboard (`/admin`)** — upload new reports (drag-and-drop),
  see stats, and delete reports. Only visible once signed in.
- Light and dark mode, remembered on each visitor's device.

Nothing here works yet out of the box — you need to connect it to a free
Supabase project first (about 10 minutes, one-time setup). Everything below
walks you through that.

---

## 2. Create your Supabase project (free)

1. Go to [supabase.com](https://supabase.com) and sign up (you can use your
   GitHub account).
2. Click **New project**. Pick any name, e.g. `csc413-report-library`, and
   any database password (save it somewhere safe, you likely won't need it
   again for this project).
3. Wait about a minute for the project to finish setting up.

### 2.1 Run the database schema

1. In your new project, open **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open `supabase/schema.sql` from this project, copy all of it, paste it
   into the SQL editor, and click **Run**.
   This creates the `reports` table and the security rules that let
   students read reports without logging in, while only you can add or
   remove them.

### 2.2 Create the storage bucket

1. In the left sidebar, open **Storage**.
2. Click **New bucket**.
3. Name it exactly `reports` (lowercase).
4. Turn **Public bucket** ON. This lets students download files directly
   without needing an account.
5. Click **Create bucket**.

The `supabase/schema.sql` file has a checklist near the bottom for the
storage policies, in case you want to double check them.

### 2.3 Create your admin account

1. In the left sidebar, open **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Type in the email and password you (the admin) want to log in with.
4. Leave **Auto Confirm User** ticked, then create the user.

That email and password are what you'll type into the Admin Login page.
You can add more admin accounts later the same way, for example if a
group member should also be able to upload.

### 2.4 Copy your project keys

1. Open **Settings → API** in the left sidebar.
2. You'll need two values from this page:
   - **Project URL**
   - **anon public** key
   You'll paste these into the app in the next step.

---

## 3. Run the project on your computer

You'll need [Node.js](https://nodejs.org) installed (version 18 or newer).

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env

# 3. Open .env and paste in your Project URL and anon key from step 2.4

# 4. Start the app
npm run dev
```

Open the link it prints (usually `http://localhost:5173`) in your browser.
Try logging in at `/admin/login` with the account you created in step 2.3,
then upload a test report to make sure everything is wired up correctly.

---

## 4. Deploy to Netlify (free)

The easiest way is connecting your GitHub repository:

1. Push this project to a new GitHub repository.
2. Go to [netlify.com](https://netlify.com) and sign in (GitHub login works).
3. Click **Add new site → Import an existing project**, and pick your
   repository.
4. Netlify should detect the build settings automatically from
   `netlify.toml` (build command `npm run build`, publish folder `dist`).
   If it asks anyway, fill those in.
5. Before deploying, open **Site settings → Environment variables** and add:
   - `VITE_SUPABASE_URL` → your Project URL
   - `VITE_SUPABASE_ANON_KEY` → your anon public key
6. Click **Deploy site**.

Netlify will give you a free `something.netlify.app` link. Share that link
with your coursemates for the public library, and keep your `/admin/login`
credentials to yourself.

### Prefer drag-and-drop instead of GitHub?

You can also run `npm run build` locally, which creates a `dist` folder,
then drag that `dist` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
You'll still need to set the two environment variables under **Site
settings → Environment variables** and redeploy once, or the site will show
the "backend not connected yet" message.

---

## 5. Everyday use

- **To add a report:** sign in at `/admin`, fill in the group number,
  title, department, and an optional short description, then drop the
  file in. It appears on the public site immediately.
- **To remove a report:** find it in the "Manage reports" list on the
  admin dashboard and click Delete.
- **Students never need to log in.** They just visit the site, search or
  filter, and click View or Download.

---

## 6. Project structure

```
src/
  components/     Reusable UI pieces (cards, nav bar, upload form, etc.)
  context/        Theme (light/dark) and auth state, shared app-wide
  lib/reports.js  All Supabase read/write calls for reports
  pages/          The three screens: Home, AdminLogin, AdminDashboard
  supabaseClient.js  Supabase connection, reads your .env values
supabase/schema.sql  Database table + security rules, run once in Supabase
```

## 7. Troubleshooting

- **"Backend not connected yet" message** — your `.env` (locally) or
  environment variables (on Netlify) are missing or still have the
  placeholder values. Double check step 2.4 and 3 or step 4.5.
- **Login fails** — confirm the user exists under Authentication → Users
  in Supabase, and that "Auto Confirm User" was checked when you made it.
- **Upload fails** — make sure the storage bucket is named exactly
  `reports` and is set to Public (step 2.2).

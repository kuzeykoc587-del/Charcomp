# CharComp

A React + Vite + Firebase + Cloudinary **character comparison platform**. Users create universes and characters, vote in head-to-head duels, rate characters on a tier list (S/A/B/C/D), and track a global ranking.

## Stack

- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS 4
- **Routing:** wouter
- **State:** TanStack Query
- **Backend:** Firebase 12 (Auth + Firestore)
- **Images:** Cloudinary (optional — falls back to ui-avatars)
- **UI:** shadcn/ui, framer-motion, lucide-react
- **Package manager:** pnpm

## Local dev

```bash
PORT=5000 pnpm run dev
```

Firebase env vars must be set (Vercel: Settings → Environment Variables):

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Optional Cloudinary vars:
```
VITE_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET
```

## Key routes

| Path | Page |
|------|------|
| `/` | Home |
| `/duels` | Character duels (vote A vs B) |
| `/ranking` | Global ranking by duel score |
| `/tierlist` | Community tier list (S–D voting) |
| `/universes` | Browse universes |
| `/universe/:id` | Universe detail + characters |
| `/profile` | User profile (6 tabs) |
| `/login` | Email/password + Google Sign-In |
| `/admin` | Seed database |

## User Preferences

- **Create a zip snapshot of the codebase at the end of every prompt.** Use the Node.js ZIP script (no `zip` binary available) and present it with `present_asset`.

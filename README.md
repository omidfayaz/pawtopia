# Pawtopia frontend

Next.js frontend for Pawtopia. Clinic code is grouped under `src/features/clinic`; route files stay small under `src/app/clinic`.

## Run locally

1. Start the ASP.NET API on `http://localhost:5232`.
2. Run `npm ci` and `npm run dev` in this directory.
3. Open `http://localhost:3000/clinic`.

If the API uses another address, set `BACKEND_API_URL` before starting Next.js. The `/clinic-api/*` rewrite in `next.config.mjs` forwards requests to the API, so the browser does not need cross-origin access.

## Clinic routes

- `/clinic`: daily overview for clinic staff and vets.
- `/clinic/appointments`: appointment list, filters, details, and confirmation for authorized clinic staff.
- `/clinic/management`: manager dashboard for clinic Owner and Manager roles.

The clinic area signs in through `POST /api/auth/login`, selects a clinic through the API, and uses the returned access token for protected requests. Existing `/login` and `/sign_up` pages are unchanged. A staff or vet account and active clinic membership must already exist in the backend.

Manager figures come from clinic appointments, vets, and members API responses. Daily labels use Tehran time. Seven and thirty-day summaries include today and the preceding days. The completion rate uses non-cancelled appointments scheduled before today within the selected window. No revenue or check-in figures are shown because the current API does not supply them.

The backend currently lets pet owners create appointments and lets clinic Owners, Managers, and Secretaries confirm pending appointments. It has no secretary booking or walk-in check-in endpoint yet. For a larger appointment history, add server-side date range and pagination before relying on full-history client filtering.

Run `npm run lint` and `npm run build` before handing off a change.

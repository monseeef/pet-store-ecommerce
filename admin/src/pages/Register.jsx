import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4 py-8">
      <div className="admin-card w-full max-w-lg p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
          Staff access
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Admin account setup
        </h2>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Admin accounts are not created from this public screen. For local development,
          create a deterministic admin with the backend seed script, or ask an existing
          admin to create a staff user from the dashboard.
        </p>
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-900">
          <p className="font-semibold">Local seed variables</p>
          <p className="mt-2 font-mono text-xs">SEED_ADMIN_EMAIL</p>
          <p className="font-mono text-xs">SEED_ADMIN_PASSWORD</p>
        </div>
        <Link
          to="/login"
          className="admin-button mt-6 w-full"
        >
          Back to admin login
        </Link>
      </div>
    </div>
  );
}

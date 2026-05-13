import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../services/reducer/authSlice";
import { IoPersonCircleOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  return (
    <div className="admin-page">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
          Account
        </p>
        <h1 className="admin-title mt-2">Profile</h1>
        <p className="admin-subtitle">Review your current admin session and access level.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="admin-card p-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <IoPersonCircleOutline className="h-16 w-16" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-slate-950">
            {user?.username || "Admin"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{user?.email || "No email available"}</p>
          <span className="admin-badge mt-4 bg-emerald-50 text-emerald-700">
            {user?.isAdmin ? "Admin" : "User"}
          </span>
        </section>

        <section className="admin-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-amber-300">
              <IoShieldCheckmarkOutline className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Access status</h3>
              <p className="text-sm text-slate-500">This dashboard is protected by admin role validation.</p>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Username</dt>
              <dd className="mt-1 text-sm font-medium text-slate-950">{user?.username || "-"}</dd>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt>
              <dd className="mt-1 text-sm font-medium text-slate-950">{user?.email || "-"}</dd>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</dt>
              <dd className="mt-1 text-sm font-medium text-slate-950">
                {user?.isAdmin ? "Administrator" : "Standard user"}
              </dd>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Session</dt>
              <dd className="mt-1 text-sm font-medium text-slate-950">Active</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Profile editing and deleting the current admin account are intentionally not exposed here during this UI pass.
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;

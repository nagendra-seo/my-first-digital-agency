import { Outlet } from "react-router-dom";

export function AdminAuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <img src="/brand/logo-light.png" alt="My First Digital Agency" width={180} height={48} className="h-10 w-auto" />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

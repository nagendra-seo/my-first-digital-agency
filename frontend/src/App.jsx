import { Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";

import { MarketingLayout } from "./layouts/MarketingLayout.jsx";
import { AdminAuthLayout } from "./layouts/AdminAuthLayout.jsx";
import { AdminDashboardLayout } from "./layouts/AdminDashboardLayout.jsx";

import Home from "./pages/marketing/Home.jsx";
import Services from "./pages/marketing/Services.jsx";
import ServiceDetail from "./pages/marketing/ServiceDetail.jsx";
import HowWeWork from "./pages/marketing/HowWeWork.jsx";
import Results from "./pages/marketing/Results.jsx";
import About from "./pages/marketing/About.jsx";
import Faq from "./pages/marketing/Faq.jsx";
import Contact from "./pages/marketing/Contact.jsx";
import FreeAudit from "./pages/marketing/FreeAudit.jsx";
import NotFound from "./pages/marketing/NotFound.jsx";

import Login from "./pages/admin/Login.jsx";
import Verify2fa from "./pages/admin/Verify2fa.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Bookings from "./pages/admin/Bookings.jsx";
import BookingDetail from "./pages/admin/BookingDetail.jsx";
import Activity from "./pages/admin/Activity.jsx";
import Settings from "./pages/admin/Settings.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/how-we-work" element={<HowWeWork />} />
        <Route path="/results" element={<Results />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/free-audit" element={<FreeAudit />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/admin/*"
        element={
          <AdminAuthProvider>
            <Routes>
              <Route element={<AdminAuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="login/verify-2fa" element={<Verify2fa />} />
              </Route>
              <Route element={<AdminDashboardLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="bookings/:id" element={<BookingDetail />} />
                <Route path="activity" element={<Activity />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </AdminAuthProvider>
        }
      />
    </Routes>
  );
}

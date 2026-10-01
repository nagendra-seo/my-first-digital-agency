import { Outlet } from "react-router-dom";
import { Header } from "../components/marketing/Header.jsx";
import { Footer } from "../components/marketing/Footer.jsx";

export function MarketingLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

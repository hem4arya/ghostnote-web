import DashboardHeader from "./DashboardHeader";
import DashboardTabs from "./DashboardTabs";
import LocalFooter from "./LocalFooter";
import LocalNavbar from "./LocalNavbar";

const DashboardPage = () => {
  return (
    <div className="bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black text-white min-h-screen">
      <LocalNavbar />
      <DashboardHeader />
      <main className="p-4 sm:p-6 md:p-8">
        <DashboardTabs />
      </main>
      <LocalFooter />
    </div>
  );
};

export default DashboardPage;

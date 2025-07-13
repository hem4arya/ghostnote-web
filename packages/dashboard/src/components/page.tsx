import DashboardHeader from 'packages/dashboard/src/components/DashboardHeader';
import DashboardTabs from 'packages/ui-components/src/DashboardTabs';
import Navbar from 'packages/shell/src/Navbar';
import Footer from 'packages/shell/src/Footer';

const DashboardPage = () => {
  return (
    <div className="bg-gradient-to-br from-ghost-black via-ghost-dark to-ghost-black text-white min-h-screen">
      <Navbar />
      <DashboardHeader />
      <main className="p-4 sm:p-6 md:p-8">
        <DashboardTabs />
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;

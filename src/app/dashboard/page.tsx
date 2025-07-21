import DashboardHeader from '@/components/DashboardHeader';
import DashboardTabs from '@/components/DashboardTabs';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';

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

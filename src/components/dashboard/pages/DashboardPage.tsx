import DashboardLayout from '../components/DashboardLayout';
import DashboardTabs from '../components/DashboardTabs';
import Navbar from '@/components/navbar/Navbar';
const DashboardPage = () => {
  return (
    <>
      <Navbar />
      <DashboardLayout>
        <DashboardTabs />
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;

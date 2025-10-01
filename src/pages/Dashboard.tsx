import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import UserDashboard from "@/components/dashboards/UserDashboard";
import ProviderDashboard from "@/components/dashboards/ProviderDashboard";
import TechnicianDashboard from "@/components/dashboards/TechnicianDashboard";
import GovernmentDashboard from "@/components/dashboards/GovernmentDashboard";

const Dashboard = () => {
  const { userRole } = useAuth();

  const renderDashboard = () => {
    switch (userRole) {
      case "admin":
        return <AdminDashboard />;
      case "user":
        return <UserDashboard />;
      case "provider":
        return <ProviderDashboard />;
      case "technician":
        return <TechnicianDashboard />;
      case "government":
        return <GovernmentDashboard />;
      default:
        return <UserDashboard />;
    }
  };

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>;
};

export default Dashboard;

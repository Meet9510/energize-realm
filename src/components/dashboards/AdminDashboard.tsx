import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Zap, DollarSign, AlertTriangle, Building2, Wrench } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEnergy: 0,
    totalRevenue: 0,
    activeFaults: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch total energy
      const { data: energyData } = await supabase
        .from("energy_data")
        .select("consumed");
      const totalEnergy = energyData?.reduce((sum, item) => sum + (parseFloat(String(item.consumed)) || 0), 0) || 0;

      // Fetch total revenue
      const { data: billsData } = await supabase
        .from("bills")
        .select("amount")
        .eq("status", "paid");
      const totalRevenue = billsData?.reduce((sum, item) => sum + (parseFloat(String(item.amount)) || 0), 0) || 0;

      // Fetch active faults
      const { count: faultsCount } = await supabase
        .from("faults")
        .select("*", { count: "exact", head: true })
        .eq("status", "open");

      setStats({
        totalUsers: usersCount || 0,
        totalEnergy: totalEnergy,
        totalRevenue: totalRevenue,
        activeFaults: faultsCount || 0,
      });
    } catch (error: any) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const mockMonthlyData = [
    { month: "Jan", energy: 4000, revenue: 24000 },
    { month: "Feb", energy: 3000, revenue: 18000 },
    { month: "Mar", energy: 5000, revenue: 30000 },
    { month: "Apr", energy: 4500, revenue: 27000 },
    { month: "May", energy: 6000, revenue: 36000 },
    { month: "Jun", energy: 5500, revenue: 33000 },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Registered users"
        />
        <StatCard
          title="Total Energy"
          value={`${stats.totalEnergy.toFixed(0)} kWh`}
          icon={Zap}
          description="System-wide consumption"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toFixed(0)}`}
          icon={DollarSign}
          description="Paid bills"
        />
        <StatCard
          title="Active Faults"
          value={stats.activeFaults}
          icon={AlertTriangle}
          description="Requiring attention"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption Trend</CardTitle>
            <CardDescription>Monthly overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="energy" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-sm text-muted-foreground">Add, edit, or remove users</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center gap-3">
              <Building2 className="h-8 w-8 text-accent" />
              <div>
                <p className="font-medium">Energy Sources</p>
                <p className="text-sm text-muted-foreground">Configure energy providers</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center gap-3">
              <Wrench className="h-8 w-8 text-warning" />
              <div>
                <p className="font-medium">System Settings</p>
                <p className="text-sm text-muted-foreground">Configure system preferences</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

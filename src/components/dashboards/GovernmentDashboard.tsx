import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Zap, Leaf, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const GovernmentDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEnergy: 0,
    co2Saved: 0,
    providers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGovernmentData();
  }, []);

  const fetchGovernmentData = async () => {
    try {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch total energy
      const { data: energyData } = await supabase
        .from("energy_data")
        .select("generated, consumed");
      const totalEnergy = energyData?.reduce((sum, item) => 
        sum + (parseFloat(String(item.generated)) || 0) + (parseFloat(String(item.consumed)) || 0), 0) || 0;

      // Calculate CO2 saved (simplified)
      const co2Saved = totalEnergy * 0.5;

      // Count providers
      const { count: providersCount } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "provider");

      setStats({
        totalUsers: usersCount || 0,
        totalEnergy: totalEnergy,
        co2Saved: co2Saved,
        providers: providersCount || 0,
      });
    } catch (error: any) {
      toast.error("Failed to load government data");
    } finally {
      setLoading(false);
    }
  };

  const regionData = [
    { region: "North", energy: 5000, users: 120 },
    { region: "South", energy: 4500, users: 100 },
    { region: "East", energy: 3800, users: 90 },
    { region: "West", energy: 4200, users: 110 },
  ];

  const energyTypeData = [
    { name: "Solar", value: 40, color: "#fbbf24" },
    { name: "Wind", value: 30, color: "#60a5fa" },
    { name: "Hydro", value: 20, color: "#34d399" },
    { name: "Biomass", value: 10, color: "#a78bfa" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Government Dashboard</h2>
        <p className="text-muted-foreground">National renewable energy overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Citizens"
          value={stats.totalUsers}
          icon={Users}
          description="Registered users"
        />
        <StatCard
          title="Total Energy"
          value={`${stats.totalEnergy.toFixed(0)} kWh`}
          icon={Zap}
          description="Generated & consumed"
        />
        <StatCard
          title="CO₂ Saved"
          value={`${stats.co2Saved.toFixed(0)} kg`}
          icon={Leaf}
          description="Environmental impact"
        />
        <StatCard
          title="Energy Providers"
          value={stats.providers}
          icon={Building2}
          description="Active providers"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Regional Energy Distribution</CardTitle>
            <CardDescription>By region</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="region" className="text-xs" />
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
            <CardTitle>Energy Source Distribution</CardTitle>
            <CardDescription>National mix</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={energyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {energyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Compliance & Impact */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Policy Compliance</CardTitle>
            <CardDescription>Renewable energy targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">National Target</span>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Carbon Reduction</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Grid Modernization</span>
                  <span className="text-sm text-muted-foreground">52%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '52%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environmental Impact</CardTitle>
            <CardDescription>Equivalent benefits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-success/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trees Planted Equivalent</span>
                  <span className="text-2xl font-bold text-success">
                    {(stats.co2Saved / 20).toFixed(0)}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-info/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cars Off Road (1 year)</span>
                  <span className="text-2xl font-bold text-info">
                    {(stats.co2Saved / 4600).toFixed(0)}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-warning/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Homes Powered (1 year)</span>
                  <span className="text-2xl font-bold text-warning">
                    {(stats.totalEnergy / 10000).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GovernmentDashboard;

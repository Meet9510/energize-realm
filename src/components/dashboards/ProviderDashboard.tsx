import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Wind, Sun, TrendingUp, Building2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { toast } from "sonner";

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [energyData, setEnergyData] = useState<any[]>([]);
  const [hardware, setHardware] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProviderData();
    }
  }, [user]);

  const fetchProviderData = async () => {
    try {
      // Fetch energy generation data
      const { data: energy, error: energyError } = await supabase
        .from("energy_data")
        .select("*")
        .eq("provider_id", user?.id)
        .order("timestamp", { ascending: false })
        .limit(30);

      if (energyError) throw energyError;
      setEnergyData(energy || []);

      // Fetch hardware
      const { data: hardwareData, error: hardwareError } = await supabase
        .from("hardware")
        .select("*")
        .eq("provider_id", user?.id);

      if (hardwareError) throw hardwareError;
      setHardware(hardwareData || []);
    } catch (error: any) {
      toast.error("Failed to load provider data");
    } finally {
      setLoading(false);
    }
  };

  const totalGenerated = energyData.reduce((sum, item) => sum + (parseFloat(String(item.generated)) || 0), 0);
  const avgDailyGeneration = energyData.length > 0 ? (totalGenerated / energyData.length).toFixed(2) : "0";
  const activeHardware = hardware.filter(h => h.status === 'operational').length;

  const chartData = energyData.slice(0, 14).reverse().map(item => ({
    date: new Date(item.timestamp).toLocaleDateString(),
    generated: parseFloat(String(item.generated)) || 0,
  }));

  const hardwareByType = hardware.reduce((acc: any, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const hardwareChartData = Object.entries(hardwareByType).map(([type, count]) => ({
    type,
    count,
  }));

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Provider Dashboard</h2>
        <p className="text-muted-foreground">Monitor energy generation and assets</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Generated"
          value={`${totalGenerated.toFixed(2)} kWh`}
          icon={Zap}
          description="Last 30 days"
        />
        <StatCard
          title="Avg Daily Output"
          value={`${avgDailyGeneration} kWh`}
          icon={TrendingUp}
          description="Per day average"
        />
        <StatCard
          title="Total Assets"
          value={hardware.length}
          icon={Building2}
          description="Hardware units"
        />
        <StatCard
          title="Active Systems"
          value={activeHardware}
          icon={Wind}
          description="Operational units"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Energy Generation Trend</CardTitle>
            <CardDescription>Last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="generated" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hardware Distribution</CardTitle>
            <CardDescription>By type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hardwareChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="type" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Hardware Status */}
      <Card>
        <CardHeader>
          <CardTitle>Hardware Assets</CardTitle>
          <CardDescription>Your renewable energy systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hardware.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No hardware registered</p>
            ) : (
              hardware.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {item.type === 'Solar Panel' ? <Sun className="h-8 w-8 text-warning" /> : <Wind className="h-8 w-8 text-info" />}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.type} • {item.location || 'No location'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'operational' ? 'bg-success/10 text-success' :
                    item.status === 'maintenance' ? 'bg-warning/10 text-warning' :
                    item.status === 'fault' ? 'bg-destructive/10 text-destructive' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderDashboard;

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Battery, TrendingDown, Zap, Leaf, DollarSign, Target } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const UserDashboard = () => {
  const { user } = useAuth();
  const [energyData, setEnergyData] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch energy data
      const { data: energy, error: energyError } = await supabase
        .from("energy_data")
        .select("*")
        .eq("user_id", user?.id)
        .order("timestamp", { ascending: false })
        .limit(30);

      if (energyError) throw energyError;
      setEnergyData(energy || []);

      // Fetch bills
      const { data: billsData, error: billsError } = await supabase
        .from("bills")
        .select("*")
        .eq("user_id", user?.id)
        .order("month", { ascending: false })
        .limit(6);

      if (billsError) throw billsError;
      setBills(billsData || []);
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const totalConsumed = energyData.reduce((sum, item) => sum + (parseFloat(item.consumed) || 0), 0);
  const avgDailyConsumption = energyData.length > 0 ? (totalConsumed / energyData.length).toFixed(2) : "0";
  const totalBillAmount = bills.reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0).toFixed(2);
  const co2Saved = (totalConsumed * 0.5).toFixed(2); // Simplified calculation

  const chartData = energyData.slice(0, 7).reverse().map(item => ({
    date: new Date(item.timestamp).toLocaleDateString(),
    consumed: parseFloat(item.consumed) || 0,
  }));

  const energySourceData = [
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
        <h2 className="text-3xl font-bold tracking-tight">Energy Dashboard</h2>
        <p className="text-muted-foreground">Track your renewable energy consumption and impact</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Consumed"
          value={`${totalConsumed.toFixed(2)} kWh`}
          icon={Zap}
          description="Last 30 days"
        />
        <StatCard
          title="Avg Daily Usage"
          value={`${avgDailyConsumption} kWh`}
          icon={Battery}
          description="Per day average"
        />
        <StatCard
          title="Total Bills"
          value={`₹${totalBillAmount}`}
          icon={DollarSign}
          description="Last 6 months"
        />
        <StatCard
          title="CO₂ Saved"
          value={`${co2Saved} kg`}
          icon={Leaf}
          description="Environmental impact"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption Trend</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="consumed" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Source Distribution</CardTitle>
            <CardDescription>Current mix</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={energySourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {energySourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bills */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bills</CardTitle>
          <CardDescription>Your billing history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bills.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No bills yet</p>
            ) : (
              bills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">
                      {new Date(bill.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-muted-foreground">{bill.units} kWh</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{parseFloat(bill.amount).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      bill.status === 'paid' ? 'bg-success/10 text-success' :
                      bill.status === 'overdue' ? 'bg-destructive/10 text-destructive' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {bill.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;

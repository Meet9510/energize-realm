import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react";
import { toast } from "sonner";

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [faults, setFaults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTechnicianData();
    }
  }, [user]);

  const fetchTechnicianData = async () => {
    try {
      // Fetch faults assigned to technician
      const { data: faultsData, error: faultsError } = await supabase
        .from("faults")
        .select(`
          *,
          hardware:hardware_id (
            name,
            type,
            location
          )
        `)
        .eq("technician_id", user?.id)
        .order("created_at", { ascending: false });

      if (faultsError) throw faultsError;
      setFaults(faultsData || []);
    } catch (error: any) {
      toast.error("Failed to load technician data");
    } finally {
      setLoading(false);
    }
  };

  const openFaults = faults.filter(f => f.status === 'open').length;
  const inProgressFaults = faults.filter(f => f.status === 'in_progress').length;
  const resolvedFaults = faults.filter(f => f.status === 'resolved').length;

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Technician Dashboard</h2>
        <p className="text-muted-foreground">Manage maintenance and repairs</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Open Faults"
          value={openFaults}
          icon={AlertTriangle}
          description="Awaiting attention"
        />
        <StatCard
          title="In Progress"
          value={inProgressFaults}
          icon={Wrench}
          description="Currently working"
        />
        <StatCard
          title="Resolved"
          value={resolvedFaults}
          icon={CheckCircle}
          description="Completed repairs"
        />
        <StatCard
          title="Total Assigned"
          value={faults.length}
          icon={Clock}
          description="All time"
        />
      </div>

      {/* Fault List */}
      <Card>
        <CardHeader>
          <CardTitle>Fault Alerts</CardTitle>
          <CardDescription>Repair tasks and maintenance logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {faults.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No faults assigned</p>
            ) : (
              faults.map((fault) => (
                <div key={fault.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{fault.hardware?.name || 'Unknown Hardware'}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          fault.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                          fault.priority === 'medium' ? 'bg-warning/10 text-warning' :
                          'bg-info/10 text-info'
                        }`}>
                          {fault.priority} priority
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {fault.hardware?.type} • {fault.hardware?.location || 'No location'}
                      </p>
                      <p className="text-sm">{fault.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Reported: {new Date(fault.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      fault.status === 'open' ? 'bg-destructive/10 text-destructive' :
                      fault.status === 'in_progress' ? 'bg-warning/10 text-warning' :
                      'bg-success/10 text-success'
                    }`}>
                      {fault.status.replace('_', ' ')}
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

export default TechnicianDashboard;

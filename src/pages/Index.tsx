
import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Ship, Anchor, Wrench, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [totalBoats, setTotalBoats] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalMaintenanceTasks, setTotalMaintenanceTasks] = useState(0);
  const [chartData, setChartData] = useState([
    { type: "Sailboat", count: 0 },
    { type: "Yacht", count: 0 },
    { type: "Speedboat", count: 0 },
  ]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch total boats and boat types
      const { data: boats, error: boatsError } = await supabase
        .from('boats')
        .select('id, type')  // Now selecting both id and type
        .eq('user_id', user.id);

      if (boatsError) throw boatsError;

      setTotalBoats(boats?.length || 0);

      // Count boats by type
      const boatTypes = {
        Sailboat: 0,
        Yacht: 0,
        Speedboat: 0,
      };

      boats?.forEach(boat => {
        if (boat.type in boatTypes) {
          boatTypes[boat.type as keyof typeof boatTypes]++;
        }
      });

      setChartData([
        { type: "Sailboat", count: boatTypes.Sailboat },
        { type: "Yacht", count: boatTypes.Yacht },
        { type: "Speedboat", count: boatTypes.Speedboat },
      ]);

      // Fetch total assets using .in() for the boat_id array
      const boatIds = boats?.map(boat => boat.id) || [];
      const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('id')
        .in('boat_id', boatIds);

      if (assetsError) throw assetsError;

      setTotalAssets(assets?.length || 0);

      // Fetch total maintenance tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id')
        .eq('user_id', user.id);

      if (tasksError) throw tasksError;

      setTotalMaintenanceTasks(tasks?.length || 0);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      if (error.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Navigation />
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Boats</CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBoats}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Anchor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Tasks</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMaintenanceTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>

      {/* Boats by Type Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Boats by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]" config={{}}>
            <BarChart data={chartData}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;

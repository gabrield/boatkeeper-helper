import React, { useState } from "react";
import { BoatList } from "@/components/BoatList";
import { BoatForm } from "@/components/BoatForm";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Ship, Anchor, Wrench, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Boat, NewBoat, Task } from "@/types/boat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { TaskList } from "@/components/TaskList";

const Index = () => {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [editingBoat, setEditingBoat] = useState<Boat | null>(null);
  const [newTask, setNewTask] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  // Calculate statistics
  const totalBoats = boats.length;
  const totalMaintenanceTasks = boats.reduce(
    (acc, boat) => acc + boat.tasks.length,
    0
  );
  const totalAssets = boats.reduce(
    (acc, boat) => acc + boat.assets.length,
    0
  );

  const boatsByType = boats.reduce((acc: Record<string, number>, boat) => {
    acc[boat.type] = (acc[boat.type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(boatsByType).map(([type, count]) => ({
    type,
    count,
  }));

  const handleAddBoat = (data: NewBoat) => {
    const newBoat: Boat = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      assets: [],
      tasks: [],
    };
    setBoats([...boats, newBoat]);
    setShowForm(false);
    toast({
      title: "Success",
      description: "Boat added successfully",
    });
  };

  const handleUpdateBoat = (data: NewBoat) => {
    if (!editingBoat) return;

    const updatedBoat: Boat = {
      ...editingBoat,
      ...data,
    };

    setBoats(boats.map((boat) => 
      boat.id === editingBoat.id ? updatedBoat : boat
    ));

    if (selectedBoat?.id === editingBoat.id) {
      setSelectedBoat(updatedBoat);
    }

    setEditingBoat(null);
    setShowForm(false);
    toast({
      title: "Success",
      description: "Boat updated successfully",
    });
  };

  const handleDeleteBoat = (id: string) => {
    setBoats(boats.filter((boat) => boat.id !== id));
    if (selectedBoat?.id === id) {
      setSelectedBoat(null);
    }
    if (editingBoat?.id === id) {
      setEditingBoat(null);
      setShowForm(false);
    }
    toast({
      title: "Success",
      description: "Boat deleted successfully",
    });
  };

  const handleEditBoat = (boat: Boat) => {
    setEditingBoat(boat);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingBoat(null);
    setShowForm(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoat || !newTask.trim()) return;

    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      description: newTask,
      completed: false,
      boatId: selectedBoat.id,
    };

    const updatedBoat = {
      ...selectedBoat,
      tasks: [...selectedBoat.tasks, task],
    };

    setBoats(
      boats.map((boat) =>
        boat.id === selectedBoat.id ? updatedBoat : boat
      )
    );
    setSelectedBoat(updatedBoat);
    setNewTask("");
    toast({
      title: "Success",
      description: "Task added successfully",
    });
  };

  const handleToggleTask = (taskId: string) => {
    if (!selectedBoat) return;

    const updatedTasks = selectedBoat.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const updatedBoat = {
      ...selectedBoat,
      tasks: updatedTasks,
    };

    setBoats(
      boats.map((boat) =>
        boat.id === selectedBoat.id ? updatedBoat : boat
      )
    );
    setSelectedBoat(updatedBoat);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!selectedBoat) return;

    const updatedTasks = selectedBoat.tasks.filter(
      (task) => task.id !== taskId
    );

    const updatedBoat = {
      ...selectedBoat,
      tasks: updatedTasks,
    };

    setBoats(
      boats.map((boat) =>
        boat.id === selectedBoat.id ? updatedBoat : boat
      )
    );
    setSelectedBoat(updatedBoat);
    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
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

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-marine-900">Your Boats</h2>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Close Form
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add New Boat
              </>
            )}
          </Button>
        </div>
        
        {showForm && (
          <div className="mb-8">
            <BoatForm 
              onSubmit={editingBoat ? handleUpdateBoat : handleAddBoat}
              editingBoat={editingBoat}
              onCancel={editingBoat ? handleCancelEdit : undefined}
            />
          </div>
        )}

        <BoatList
          boats={boats}
          onDelete={handleDeleteBoat}
          onSelect={setSelectedBoat}
          onEdit={handleEditBoat}
        />
      </div>

      {selectedBoat && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-marine-900">
            Maintenance Tasks for {selectedBoat.name}
          </h2>
          <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1"
            />
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </form>
          <TaskList
            tasks={selectedBoat.tasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
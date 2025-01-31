import React, { useState } from "react";
import { BoatList } from "@/components/BoatList";
import { BoatForm } from "@/components/BoatForm";
import { TaskList } from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Boat, NewBoat, Task } from "@/types/boat";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [editingBoat, setEditingBoat] = useState<Boat | null>(null);
  const [newTask, setNewTask] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

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
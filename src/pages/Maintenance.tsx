
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task, TaskStatus } from "@/types/boat";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TaskList } from "@/components/TaskList";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Maintenance = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task description",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      boat_id: "temporary", // This will be set properly when we integrate with Supabase
      description: newTaskDescription,
      completed: false,
      status: "todo",
      priority: "medium",
      due_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      user_id: user.id
    };

    setTasks([...tasks, task]);
    setNewTaskDescription("");
    toast({
      title: "Success",
      description: "Task added successfully",
    });
  };

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleUpdateTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
    toast({
      title: "Success",
      description: "Task updated successfully",
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    handleStatusChange(taskId, status);
  };

  return (
    <div className="container mx-auto py-8">
      <Navigation />
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Maintenance Tasks</h2>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
          <Input
            placeholder="Add a new maintenance task..."
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["todo", "in_progress", "done"] as TaskStatus[]).map((status) => (
            <div
              key={status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <TaskList
                tasks={tasks}
                status={status}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                onUpdate={handleUpdateTask}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;

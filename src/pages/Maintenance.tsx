import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task, TaskStatus } from "@/types/boat";
import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Maintenance = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const { toast } = useToast();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task description",
        variant: "destructive",
      });
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

  return (
    <div className="container mx-auto py-8">
      <Navigation />
      <div className="max-w-2xl mx-auto">
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

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleTask(task.id)}
                >
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </Button>
                <span
                  className={`${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.description}
                </span>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-gray-500 text-center">
              No maintenance tasks added yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task, TaskStatus, Boat } from "@/types/boat";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TaskList } from "@/components/TaskList";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Maintenance = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedBoatId, setSelectedBoatId] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoats();
  }, []);

  useEffect(() => {
    if (selectedBoatId) {
      fetchTasks();
    }
  }, [selectedBoatId]);

  const fetchBoats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data: boats, error } = await supabase
      .from('boats')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch boats",
        variant: "destructive",
      });
      return;
    }

    setBoats(boats);
    if (boats.length > 0) {
      setSelectedBoatId(boats[0].id);
    }
  };

  const fetchTasks = async () => {
    if (!selectedBoatId) return;

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('boat_id', selectedBoatId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
      return;
    }

    // Explicitly cast the status to TaskStatus
    setTasks(tasks.map(task => ({
      ...task,
      status: task.status as TaskStatus,
      priority: task.priority as Task['priority']
    })));
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoatId) {
      toast({
        title: "Error",
        description: "Please select a boat",
        variant: "destructive",
      });
      return;
    }

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

    const { data: task, error } = await supabase
      .from('tasks')
      .insert([{
        description: newTaskDescription,
        boat_id: selectedBoatId,
        completed: false,
        status: "todo" as TaskStatus,
        priority: "medium",
        due_date: new Date().toISOString(),
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
      return;
    }

    // Explicitly cast the new task's status
    const typedTask: Task = {
      ...task,
      status: task.status as TaskStatus,
      priority: task.priority as Task['priority']
    };

    setTasks([...tasks, typedTask]);
    setNewTaskDescription("");
    toast({
      title: "Success",
      description: "Task added successfully",
    });
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      return;
    }

    setTasks(tasks.filter((task) => task.id !== id));
    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleUpdateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updatedTask)
      .eq('id', taskId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      return;
    }

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
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <label htmlFor="boat-select" className="text-sm font-medium">
              Select Boat
            </label>
            <Select value={selectedBoatId} onValueChange={setSelectedBoatId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a boat" />
              </SelectTrigger>
              <SelectContent>
                {boats.map((boat) => (
                  <SelectItem key={boat.id} value={boat.id}>
                    {boat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <form onSubmit={handleAddTask} className="flex gap-2">
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
        </div>

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


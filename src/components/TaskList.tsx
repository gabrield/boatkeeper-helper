import React from "react";
import { Task } from "@/types/boat";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskList = ({ tasks, onToggle, onDelete }: TaskListProps) => {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
        >
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggle(task.id)}
            />
            <span
              className={`${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.description}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
    </div>
  );
};
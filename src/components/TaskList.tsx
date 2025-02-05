import React from "react";
import { Task, TaskStatus } from "@/types/boat";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  status: TaskStatus;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const TaskList = ({ tasks, status, onToggle, onDelete, onStatusChange }: TaskListProps) => {
  const filteredTasks = tasks.filter((task) => task.status === status);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  return (
    <div className="space-y-2 min-h-[200px]">
      <h3 className="text-lg font-semibold capitalize mb-4">{status}</h3>
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          className="flex flex-col p-3 bg-white rounded-lg shadow cursor-move hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-red-500"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </Button>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
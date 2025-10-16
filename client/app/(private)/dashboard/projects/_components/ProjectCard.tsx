"use client";

import React from "react";
import Link from "next/link";
import { Delete, DeleteIcon, Edit, PlusIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUpdateProjectTodoStatusMutation } from "@/hooks/query/projects/useUpdateProjectTodoStatusMutation";
import { useDeleteProjectTodoMutation } from "@/hooks/query/projects/useDeleteProjectTodoMutation";
import { useDeleteProjectMutation } from "@/hooks/query/projects/useDeleteProjectMutation";

// --- TYPES ---
type Todo = {
  _id: string;
  title: string;
  status: "in progress" | "completed" | "cancelled";
};

type Project = {
  _id: string;
  projectName: string;
  description: string;
  budget: number;
  status: string;
  projectTodos: Todo[];
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { mutate: updateStatus, isPending } =
    useUpdateProjectTodoStatusMutation();
  const { mutate: deleteTodo, isPending: isDeletePending } =
    useDeleteProjectTodoMutation();
  const { mutate: deleteProject, isPending: isDeleteProjectPedning } =
    useDeleteProjectMutation();

  const handleStatusChange = (
    newStatus: "in progress" | "completed" | "cancelled",
    todoId: string
  ) => {
    updateStatus({
      id: project._id,
      todoId: todoId,
      data: { status: newStatus },
    });
  };

  const handleDeleteTodo = (todoId: string) => {
    // This now correctly receives the todoId and calls the mutation
    deleteTodo({ id: project._id, todoId: todoId });
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>{project.projectName}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
          <CardDescription>Budget: ${project.budget}</CardDescription>
          <CardDescription>Status: {project.status}</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Link href={`/dashboard/projects/edit/${project._id}`}>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/projects/createTodo/${project._id}`}>
            <Button variant="ghost" size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            onClick={() => handleDeleteProject(project._id)}
            type="button"
            variant="ghost"
            size="icon"
          >
            <DeleteIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <h4 className="font-semibold">Tasks</h4>
        {project.projectTodos && project.projectTodos.length > 0 ? (
          project.projectTodos.map((todo) => (
            <div
              key={todo._id}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <p className="flex-1 pr-4">{todo.title}</p>
              <div className="flex items-center space-x-2">
                <Select
                  value={todo.status}
                  onValueChange={(newStatus: any) =>
                    handleStatusChange(newStatus, todo._id)
                  }
                  disabled={isPending || isDeletePending}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Link
                  href={`/dashboard/projects/editTodo/${project._id}/${todo._id}`}
                >
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>

                {/* --- FIX IS HERE --- */}
                {/* It now passes the correct todo._id to the handler */}
                <Button
                  onClick={() => handleDeleteTodo(todo._id)}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  disabled={isPending || isDeletePending}
                >
                  <Delete className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No tasks in this project yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

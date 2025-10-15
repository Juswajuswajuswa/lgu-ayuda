"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Delete, Edit, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProjectTodoSchema {
  title: string;
}

interface ProjectCardProps {
  projectName: string;
  description: string;
  budget: number;
  status?: boolean;
  projectTodos: ProjectTodoSchema[];
}

interface Project {
  project: ProjectCardProps;
}

export default function ProjectCard({ project }: Project) {
  console.log(project.projectTodos);

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>{project.projectName}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
          <CardDescription>{project.budget}</CardDescription>
        </div>

        <div className="flex space-x-2">
          <Link href={`/dashboard/projects/edit/${project._id}`}>
            <Edit />
          </Link>

          <Link href={`/dashboard/projects/createTodo/${project._id}`}>
            <PlusIcon />
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {project.projectTodos && project.projectTodos.length > 1 ? (
          project.projectTodos.map((todo) => (
            <div key={todo._id} className="flex items-center  justify-between">
              <p>{todo.title}</p>
              <div className="flex space-x-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-progress">In progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Link
                  href={`/dashboard/projects/editTodo/${project._id}/${todo._id}`}
                >
                  <Button variant="ghost" size="icon">
                    <Edit />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-600"
                >
                  <Delete />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>no todo</p>
        )}
      </CardContent>
    </Card>
  );
}

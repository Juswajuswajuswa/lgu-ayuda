"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { ArrowLeftIcon, Loader2 } from "lucide-react";

// Assuming these paths are correct for your project structure
import { useProject } from "@/hooks/query/projects/useProject";
import { useCreateProjectTodoMutation } from "@/hooks/query/projects/useCreateProjectTodoMutation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/forms/common/FormField";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  projectsFormSchema,
  projectsTodoSchema,
  ProjectTodoFormData,
} from "@/schema/forms/projects";

export default function AddTodoPage() {
  const params = useParams();
  const { id } = params as { id: string };

  const { data: response, isPending: isProjectPending } = useProject(id);
  const project = response?.project;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProjectTodoFormData>({
    resolver: zodResolver(projectsTodoSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutate: addTodo, isPending: isAddTodoPending } =
    useCreateProjectTodoMutation();

  const onSubmit = (data: ProjectTodoFormData) => {
    // The mutation hook expects an object with id and data
    addTodo({ id, data });
  };

  if (isProjectPending) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-6">
          <Link
            href={`/dashboard/projects`} // Link back to the specific project page
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Project
          </Link>
          <CardTitle>Add New Todo</CardTitle>
          <CardDescription>
            Add a new task to project: {project?.projectName || "..."}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            label="Todo Title"
            placeholder="e.g., Design the landing page"
            error={errors.title}
            required
            {...register("title")}
          />

          {/* <div className="space-y-2">
            <Label>Status</Label>
            <Select
              defaultValue="in progress"
              onValueChange={(value) =>
                setValue("status", value as any, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div> */}

          <Button type="submit" className="w-full" disabled={isAddTodoPending}>
            {isAddTodoPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Todo"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { ArrowLeftIcon, Loader2 } from "lucide-react";

// Assuming these paths are correct for your project structure
import { useProject } from "@/hooks/query/projects/useProject";
// You will need to create a mutation hook for updating todos

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
import { CreateProjectTodoInput } from "@/schema/api/projects";
import { projectsTodoSchema } from "@/schema/forms/projects";
import useUpdateProjectTodoMutation from "@/hooks/query/projects/useUpdateProjectTodoMutation";

export default function EditTodoPage() {
  const params = useParams();
  const { projectId, todoId } = params as { projectId: string; todoId: string };

  const { data: response, isPending: isProjectPending } = useProject(projectId);
  const project = response?.data;

  console.log(project);

  const todo = project?.projectTodos.find((t: any) => t._id === todoId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateProjectTodoInput>({
    resolver: zodResolver(projectsTodoSchema),
  });

  // Populate the form with the todo's data once it's loaded
  useEffect(() => {
    if (todo) {
      reset({
        title: todo.title,
      });
    }
  }, [todo, reset]);

  const { mutate: updateTodo, isPending: isUpdatePending } =
    useUpdateProjectTodoMutation();

  const onSubmit = (data: CreateProjectTodoInput) => {
    // The mutation hook will need the project ID, todo ID, and the form data
    updateTodo({ id: projectId, todoId, data });
  };

  //   if (isProjectPending) {
  //     return (
  //       <div className="flex items-center justify-center h-48">
  //         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  //       </div>
  //     );
  //   }

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
          <CardTitle>Update Todo</CardTitle>
          <CardDescription>
            Editing todo in project: {project?.projectName || "..."}
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
              // Use the todo's current status as the value
              value={todo?.status}
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

          <Button type="submit" className="w-full" disabled={isUpdatePending}>
            {isUpdatePending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Todo"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

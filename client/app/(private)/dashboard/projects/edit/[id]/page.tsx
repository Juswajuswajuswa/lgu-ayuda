"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { ArrowLeftIcon, Loader2 } from "lucide-react";

import { ProjectsFormData, projectsFormSchema } from "@/schema/forms/projects";
import { useProject } from "@/hooks/query/projects/useProject";
import useUpdateProjectsMutation from "@/hooks/query/projects/useUpdateProjectsMutation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/forms/common/FormField"; // Assuming this custom component
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditProjectPage() {
  const params = useParams();
  const { id } = params as { id: string };

  const { data: response, isPending: isProjectPending } = useProject(id);
  const project = response?.data;

  console.log(project);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue, // We need setValue for the Select component
  } = useForm<ProjectsFormData>({
    resolver: zodResolver(projectsFormSchema),
    // Default values are set dynamically in the useEffect
  });

  const { mutate: updateProject, isPending: isUpdatePending } =
    useUpdateProjectsMutation(id);

  // useEffect to populate the form once the project data is loaded
  useEffect(() => {
    if (project) {
      // Use reset to populate all form fields at once
      reset({
        projectName: project.projectName,
        description: project.description || "",
        budget: project.budget,
        status: project.status,
      });
    }
  }, [project, reset]); // Rerun effect only when project or reset changes

  const onSubmit = (data: ProjectsFormData) => {
    updateProject(data);
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
            href="/dashboard/projects"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>Update the details of your project.</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            label="Project Name"
            placeholder="e.g., Q4 Marketing Campaign"
            error={errors.projectName}
            required
            {...register("projectName")}
          />

          <FormField
            as="textarea"
            label="Description"
            placeholder="Describe the project..."
            error={errors.description}
            required
            {...register("description")}
          />

          <FormField
            label="Budget"
            type="number"
            placeholder="0"
            min={0}
            error={errors.budget}
            required
            {...register("budget", { valueAsNumber: true })}
          />

          {/* Status Dropdown
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              // Set the value from the project data
              defaultValue={project?.status}
              // Update the form state when the user selects a new value
              onValueChange={(value) =>
                setValue("status", value, { shouldValidate: true })
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
              "Update Project"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeftIcon, Loader2 } from "lucide-react";

import { ProjectsFormData, projectsFormSchema } from "@/schema/forms/projects";
import useCreateProjectsMutation from "@/hooks/query/projects/useCreateProjectsMutation";

// Assuming a custom FormField component exists at this path
import { FormField } from "@/components/forms/common/FormField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateProjectForm() {
  // 1. Destructure directly from useForm
  const {
    register,
    handleSubmit,
    control, // Keep control for the Select component
    formState: { errors },
  } = useForm<ProjectsFormData>({
    resolver: zodResolver(projectsFormSchema),
    defaultValues: {
      projectName: "",
      description: "",
      budget: 0,
      status: "in progress",
    },
  });

  const { mutate: createProjects, isPending } = useCreateProjectsMutation();

  const onSubmit = (data: ProjectsFormData) => {
    createProjects(data);
  };

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
          <CardTitle>Create Project</CardTitle>
          <CardDescription>Create a new project to manage.</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {/* 2. Use a standard form tag with handleSubmit */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Use the custom FormField for text and number inputs */}
          <FormField
            label="Project Name"
            placeholder="e.g., Q4 Marketing Campaign"
            error={errors.projectName}
            required
            {...register("projectName")}
          />

          <FormField
            as="textarea" // Assuming your component accepts an 'as' prop
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

          {/* For complex fields like Select, it's common to handle them separately */}
          {/* <div className="space-y-2">
            <Label>Status</Label>
            <Select
              defaultValue="in progress"
              onValueChange={(value) => form.setValue("status", value)} // Set value on change
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

          {/* 3. Update the button with the loader */}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

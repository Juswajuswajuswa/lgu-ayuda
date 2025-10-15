import FormField from "@/components/forms/common/FormField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function CreateProjectForm() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-6">
          <Link
            href="/dashboard/projects"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
          <CardTitle>Create Project</CardTitle>
        </div>
        <CardDescription>Create a new project</CardDescription>
        <CardContent>
          <form className="flex flex-col gap-2">
            <FormField label="Project Name" />
            <FormField type="text" label="Description" />
            <FormField type="number" label="Budget" />

            <Button type="submit">Add Project</Button>
          </form>
        </CardContent>
      </CardHeader>
    </Card>
  );
}

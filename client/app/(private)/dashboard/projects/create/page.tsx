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
            href="/dashboard/beneficiaries"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
          <CardTitle>Create Project</CardTitle>
        </div>
        <CardDescription>Create a new project</CardDescription>
        <CardContent>
          <form></form>
        </CardContent>
      </CardHeader>
    </Card>
  );
}

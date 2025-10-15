import { Button, buttonVariants } from "@/components/ui/button";

import React from "react";
import ProjectCard from "./_components/ProjectCard";
import Link from "next/link";

export default function Projects() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1>Projects</h1>
        <div>

        <Link href={"/dashboard/projects/create"} className={buttonVariants()}>
          Create Project
        </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
    </>
  );
}

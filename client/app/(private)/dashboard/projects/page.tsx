"use client";

import { Button, buttonVariants } from "@/components/ui/button";

import React from "react";
import ProjectCard from "./_components/ProjectCard";
import Link from "next/link";
import useProjects from "@/hooks/query/projects/userProjects";

export default function Projects() {
  const { data: response, isPending, isError } = useProjects();

  const projects = response?.data || [];

  console.log(projects);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1>Projects</h1>
        <div>
          <Link
            href={"/dashboard/projects/create"}
            className={buttonVariants()}
          >
            Create Project
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard project={project} key={project._id} />
          ))
        ) : (
          <>
            <p>no project</p>
          </>
        )}
      </div>
    </>
  );
}

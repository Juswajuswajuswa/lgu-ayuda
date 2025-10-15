"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Delete, Edit, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectCard() {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>Project</CardTitle>
        <div className="flex space-x-2">
          <Button variant={"outline"}>
            <Edit />
          </Button>
          <Button>
            <PlusIcon />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center  justify-between">
          <p>Tumae</p>
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
            <Button variant="ghost">
              <Edit />
            </Button>
            <Button variant="ghost" className="text-red-500 hover:text-red-600">
              <Delete />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

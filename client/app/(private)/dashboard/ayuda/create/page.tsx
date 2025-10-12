"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function CreateAyudaPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: 0,
    goods: "",
    type: "",
    budget: 0,
  });

  const { data: goods = [] } = useQuery({
    queryKey: ["goods"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/goods/get-goods`);
      return res.data;
    },
  });

  console.log(goods);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="space-y-6">
            <Link
              href={"/dashboard/ayuda"}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </Link>
            <CardTitle>Create Ayuda</CardTitle>
          </div>
          <CardDescription>Create a new Ayuda</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="w-full space-y-2">
              <Label htmlFor="name">Ayuda</Label>
              <Input
                id="name"
                placeholder="Ayuda"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="w-full space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="w-full" id="type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash" id="cash">
                    Cash
                  </SelectItem>
                  <SelectItem value="goods" id="goods">
                    Goods
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === "cash" && (
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" name="amount" placeholder="Amount" />
              </div>
            )}

            {formData.type === "goods" && (
              <div className="space-x-2 flex items-center">
                <div className="space-y-2">
                  <Label>Type</Label>

                  <div className="flex space-x-2">
                    <Select
                      value={formData.goods}
                      onValueChange={(value) =>
                        setFormData({ ...formData, goods: value })
                      }
                    >
                      <SelectTrigger className="w-[500px]" id="type">
                        <SelectValue placeholder="Select goods" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash" id="cash">
                          Cash
                        </SelectItem>
                        <SelectItem value="goods" id="goods">
                          Goods
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button">Add</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Budget</Label>
              <Input type="number" name="amount" placeholder="Budget" />
            </div>
            {/* <div className="mt-5">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div> */}
          </form>
        </CardContent>
      </Card>
    </>
  );
}

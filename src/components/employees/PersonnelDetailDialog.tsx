
"use client";

import type { InHouseEmployee, Subcontractor } from "@/lib/definitions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PersonnelDetailDialogProps {
  person: InHouseEmployee | Subcontractor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PersonnelDetailDialog({ person, open, onOpenChange }: PersonnelDetailDialogProps) {
  if (!person) return null;

  const isSubcontractor = 'dnrCapacity' in person;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{person.name}</DialogTitle>
          <DialogDescription>
            Details for {isSubcontractor ? "Subcontractor" : "In-House Employee"} ID: {person.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">ID:</p>
            <p className="text-sm">{person.id}</p>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Name:</p>
            <p className="text-sm">{person.name}</p>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Work Type:</p>
            <p className="text-sm">{person.workType}</p>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Phone Number:</p>
            <p className="text-sm">{person.contact}</p>
          </div>
          {isSubcontractor && (
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">DNR Capacity:</p>
              <p className="text-sm">
                <Badge variant={person.dnrCapacity === "none" ? "outline" : "secondary"}>
                  {person.dnrCapacity.toUpperCase()}
                </Badge>
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

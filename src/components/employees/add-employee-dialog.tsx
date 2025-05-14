
"use client";

import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { dnrCapacities, type InHouseEmployee, type Subcontractor, type DnrCapacity } from "@/lib/definitions";
import { Label } from "@/components/ui/label";

const baseSchema = {
  name: z.string().min(2, "Name must be at least 2 characters."),
  workType: z.string().min(2, "Work type must be at least 2 characters."),
  contact: z.string().email("Invalid email address."),
};

const inHouseEmployeeSchema = z.object(baseSchema);

const subcontractorSchema = z.object({
  ...baseSchema,
  dnrCapacity: z.enum(dnrCapacities, {
    errorMap: () => ({ message: "DNR capacity is required." }),
  }),
});

type FormValues = z.infer<typeof inHouseEmployeeSchema> | z.infer<typeof subcontractorSchema>;

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (person: InHouseEmployee | Subcontractor) => void;
}

export function AddEmployeeDialog({ open, onOpenChange, onSave }: AddEmployeeDialogProps) {
  const [personType, setPersonType] = React.useState<"inHouse" | "subcontractor">("inHouse");

  const currentSchema = personType === "inHouse" ? inHouseEmployeeSchema : subcontractorSchema;

  const form = useForm<FormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      name: "",
      workType: "",
      contact: "",
      ...(personType === "subcontractor" && { dnrCapacity: "none" }),
    },
  });
  
  React.useEffect(() => {
    form.reset({
        name: "",
        workType: "",
        contact: "",
        ...(personType === "subcontractor" ? { dnrCapacity: "none" as DnrCapacity } : {}),
    });
  }, [personType, form]);


  const onSubmit = (data: FormValues) => {
    if (personType === "inHouse") {
      onSave(data as Omit<InHouseEmployee, "id">);
    } else {
      onSave(data as Omit<Subcontractor, "id">);
    }
    form.reset();
    onOpenChange(false); // Close dialog on successful save
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Personnel</DialogTitle>
          <DialogDescription>
            Fill in the details for the new employee or subcontractor.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="personTypeInternal" // Not part of schema, just for RadioGroup
              render={({ field }) => ( // field is not used directly here
                <FormItem className="space-y-3">
                  <FormLabel>Personnel Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value: "inHouse" | "subcontractor") => {
                        setPersonType(value);
                      }}
                      defaultValue={personType}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="inHouse" id="inHouse" />
                        </FormControl>
                        <Label htmlFor="inHouse" className="font-normal">In-House Employee</Label>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="subcontractor" id="subcontractor" />
                        </FormControl>
                        <Label htmlFor="subcontractor" className="font-normal">Subcontractor</Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Type / Specialization</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sewing, Cutting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Info (Email)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {personType === "subcontractor" && (
              <FormField
                control={form.control}
                name="dnrCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNR Capacity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value as DnrCapacity | undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select DNR capacity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dnrCapacities.map((capacity) => (
                          <SelectItem key={capacity} value={capacity}>
                            {capacity.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save Personnel</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

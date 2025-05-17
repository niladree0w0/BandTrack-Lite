
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
import { dnrCapacities, type InHouseEmployee, type Subcontractor, type DnrCapacity, type BaseEmployee } from "@/lib/definitions";
import { Label } from "@/components/ui/label";

// Combined type for form values to handle both creation and editing
export type PersonnelFormValues = Omit<BaseEmployee, "id"> & {
  id?: string; // Optional ID, present during edit
  personType: "inHouse" | "subcontractor";
  dnrCapacity?: DnrCapacity; // Optional, only for subcontractors
};


const personnelFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  workType: z.string().min(2, "Work type must be at least 2 characters."),
  contact: z.string().min(7, "Phone number must be at least 7 digits.").regex(/^\+?[0-9\s-()]{7,20}$/, "Invalid phone number format."),
  personType: z.enum(["inHouse", "subcontractor"]),
  dnrCapacity: z.enum(dnrCapacities).optional(),
}).refine(data => {
  if (data.personType === "subcontractor" && !data.dnrCapacity) {
    return false;
  }
  return true;
}, {
  message: "DNR capacity is required for subcontractors.",
  path: ["dnrCapacity"],
});


interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (person: PersonnelFormValues) => void;
  initialData?: Partial<PersonnelFormValues>; // For editing
}

export function AddEmployeeDialog({ open, onOpenChange, onSave, initialData }: AddEmployeeDialogProps) {
  const isEditMode = !!initialData?.id;
  const [personType, setPersonType] = React.useState<"inHouse" | "subcontractor">(initialData?.personType || "inHouse");
  
  const form = useForm<PersonnelFormValues>({
    resolver: zodResolver(personnelFormSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      name: initialData?.name || "",
      workType: initialData?.workType || "",
      contact: initialData?.contact || "",
      personType: initialData?.personType || "inHouse",
      dnrCapacity: initialData?.dnrCapacity || (initialData?.personType === "subcontractor" ? "none" : undefined),
    },
  });
  
  React.useEffect(() => {
    if (open) {
      const defaultPersonType = initialData?.personType || "inHouse";
      const defaultDnrCapacity = (initialData?.personType === "subcontractor" && initialData.dnrCapacity)
        ? initialData.dnrCapacity
        : (defaultPersonType === "subcontractor" ? "none" : undefined);

      form.reset({
        id: initialData?.id || undefined,
        name: initialData?.name || "",
        workType: initialData?.workType || "",
        contact: initialData?.contact || "",
        personType: defaultPersonType,
        dnrCapacity: defaultDnrCapacity,
      });
      setPersonType(defaultPersonType);
    }
  }, [open, initialData, form.reset, setPersonType]); // Using form.reset and setPersonType as stable refs

  React.useEffect(() => {
    // Update dnrCapacity in form when personType changes
    if (personType === "inHouse") {
      form.setValue("dnrCapacity", undefined);
    } else if (personType === "subcontractor" && !form.getValues("dnrCapacity")) {
      form.setValue("dnrCapacity", "none");
    }
  }, [personType, form]);


  const onSubmit = (data: PersonnelFormValues) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        // Reset form and local state when dialog is closed without saving
        form.reset({ 
            id: undefined, 
            name: "", 
            workType: "", 
            contact: "", 
            personType: "inHouse", 
            dnrCapacity: undefined 
        });
        setPersonType("inHouse");
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Personnel" : "Add New Personnel"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for the personnel." : "Fill in the details for the new employee or subcontractor."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="personType"
              render={({ field }) => ( 
                <FormItem className="space-y-3">
                  <FormLabel>Personnel Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value: "inHouse" | "subcontractor") => {
                        field.onChange(value);
                        setPersonType(value);
                      }}
                      value={field.value}
                      className="flex space-x-4"
                      disabled={isEditMode} // This disables the group if in edit mode
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
                  <FormLabel>Contact Info (Phone)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g., 555-123-4567" {...field} />
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
                    <Select 
                        onValueChange={field.onChange} 
                        value={field.value || "none"} // Ensure value is one of the enum
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select DNR capacity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dnrCapacities.map((capacity) => (
                          <SelectItem key={capacity} value={capacity}>
                            {capacity === "both" ? "Both 300dnr & 600dnr" : capacity.toUpperCase()}
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
              <Button type="submit">{isEditMode ? "Save Changes" : "Save Personnel"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
 
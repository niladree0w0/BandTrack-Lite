
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderSubcontractors, placeholderDispatches } from "@/lib/placeholder-data"; 
import type { Subcontractor } from "@/lib/definitions"; 
import { materialTypes } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import type { MaterialDispatch } from "@/lib/definitions";
import { useState, useEffect } from "react";
import { Send, ShieldAlert } from "lucide-react"; 
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions";

const dispatchFormSchema = z.object({
  subcontractorId: z.string().min(1, "Subcontractor is required."),
  materialType: z.string().min(1, "Material type is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
});

type DispatchFormValues = z.infer<typeof dispatchFormSchema>;

export default function DispatchPage() {
  const { toast } = useToast();
  const [dispatches, setDispatches] = useState<MaterialDispatch[]>([]);
  const [subcontractorOptions, setSubcontractorOptions] = useState<Subcontractor[]>([]);
  const { user } = useAuth();
  const canManageDispatch = user && hasPermission(user, 'manageDispatch');

  useEffect(() => {
    setDispatches(placeholderDispatches);
    setSubcontractorOptions(placeholderSubcontractors);
  }, []);
  
  const form = useForm<DispatchFormValues>({
    resolver: zodResolver(dispatchFormSchema),
    defaultValues: {
      subcontractorId: "",
      materialType: "",
      quantity: 1,
    },
    disabled: !canManageDispatch, // Disable form if user cannot manage
  });

  function onSubmit(data: DispatchFormValues) {
    if (!canManageDispatch) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to create dispatches.",
        variant: "destructive",
      });
      return;
    }

    const selectedSubcontractor = subcontractorOptions.find(s => s.id === data.subcontractorId);
    const newDispatch: MaterialDispatch = {
      id: `disp${dispatches.length + 1}`, 
      subcontractorId: data.subcontractorId,
      subcontractorName: selectedSubcontractor?.name,
      materialType: data.materialType,
      quantity: data.quantity,
      dispatchDate: new Date().toISOString(),
    };
    setDispatches(prev => [newDispatch, ...prev]);
    toast({
      title: "Dispatch Created",
      description: `Material ${data.materialType} dispatched to ${newDispatch.subcontractorName || 'Subcontractor'} (${selectedSubcontractor?.dnrCapacity || ''}).`,
    });
    form.reset();
  }

  if (!canManageDispatch) { // Covers view access too for this specific page's core functionality
    return (
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Access Denied" 
          description="You do not have permission to manage dispatches." 
        />
        <Card className="shadow-md">
          <CardHeader className="items-center">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg font-semibold">Permission Required</p>
            <p className="text-sm text-muted-foreground">
              Please contact an administrator if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dispatch Manager"
        description="Streamline material dispatch to subcontractors."
        actions={
            <Button onClick={form.handleSubmit(onSubmit)} disabled={!canManageDispatch}>
                <Send className="mr-2 h-4 w-4" />Create Dispatch
            </Button>
        }
      />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>New Material Dispatch</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="subcontractorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcontractor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!canManageDispatch}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subcontractor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcontractorOptions.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.name} ({sub.dnrCapacity === "none" ? "No DNR Spec" : sub.dnrCapacity.toUpperCase()}) - ID: {sub.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="materialType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!canManageDispatch}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select material type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {materialTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter quantity" {...field} disabled={!canManageDispatch}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Dispatches</CardTitle>
        </CardHeader>
        <CardContent>
          {dispatches.length === 0 ? (
            <p className="text-sm text-muted-foreground">No dispatches recorded yet.</p>
          ) : (
            <ul className="space-y-2">
              {dispatches.slice(0, 5).map(d => {
                const sub = subcontractorOptions.find(s => s.id === d.subcontractorId);
                return (
                  <li key={d.id} className="text-sm p-2 border rounded-md bg-muted/50">
                    {d.quantity} units of {d.materialType} to {d.subcontractorName || d.subcontractorId} 
                    {sub ? ` (${sub.dnrCapacity.toUpperCase()})` : ''} on {new Date(d.dispatchDate).toLocaleDateString()}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

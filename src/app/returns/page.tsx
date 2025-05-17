
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
import { placeholderSubcontractors, placeholderReturns } from "@/lib/placeholder-data";
import type { Subcontractor } from "@/lib/definitions";
import { qualityStatuses } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import type { MaterialReturn } from "@/lib/definitions";
import { useState, useEffect } from "react";
import { Save, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions";

const returnFormSchema = z.object({
  subcontractorId: z.string().min(1, "Subcontractor is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  qualityStatus: z.enum(qualityStatuses, {
    errorMap: () => ({ message: "Quality status is required." }),
  }),
});

type ReturnFormValues = z.infer<typeof returnFormSchema>;

export default function ReturnsPage() {
  const { toast } = useToast();
  const [returns, setReturns] = useState<MaterialReturn[]>([]);
  const [subcontractorOptions, setSubcontractorOptions] = useState<Subcontractor[]>([]);
  const { user } = useAuth();
  const canManageReturns = user && hasPermission(user, 'manageReturns');

  useEffect(() => {
    setReturns(placeholderReturns);
    setSubcontractorOptions(placeholderSubcontractors);
  }, []);

  const form = useForm<ReturnFormValues>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
      subcontractorId: "",
      quantity: 1,
    },
    disabled: !canManageReturns, // Disable form if user cannot manage
  });

  function onSubmit(data: ReturnFormValues) {
    if (!canManageReturns) {
       toast({
        title: "Permission Denied",
        description: "You do not have permission to log returns.",
        variant: "destructive",
      });
      return;
    }
    const selectedSubcontractor = subcontractorOptions.find(s => s.id === data.subcontractorId);
    const newReturn: MaterialReturn = {
      id: `ret${returns.length + 1}`, 
      subcontractorId: data.subcontractorId,
      subcontractorName: selectedSubcontractor?.name,
      quantity: data.quantity,
      qualityStatus: data.qualityStatus,
      returnDate: new Date().toISOString(),
    };
    setReturns(prev => [newReturn, ...prev]);

    toast({
      title: "Return Logged",
      description: `${data.quantity} units returned by ${newReturn.subcontractorName || 'Subcontractor'} (${selectedSubcontractor?.dnrCapacity || ''}) with status ${data.qualityStatus}.`,
    });
    form.reset();
  }
  
  if (!canManageReturns) { // Covers view access too for this specific page's core functionality
    return (
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Access Denied" 
          description="You do not have permission to manage material returns." 
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
        title="Return Logger"
        description="Record finished goods returned by subcontractors."
        actions={
            <Button onClick={form.handleSubmit(onSubmit)} disabled={!canManageReturns}>
                <Save className="mr-2 h-4 w-4" />Log Return
            </Button>
        }
      />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Log New Return</CardTitle>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!canManageReturns}>
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
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity Returned</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter quantity" {...field} disabled={!canManageReturns} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualityStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quality Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!canManageReturns}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {qualityStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
          <CardTitle>Recent Returns</CardTitle>
        </CardHeader>
        <CardContent>
          {returns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No returns logged yet.</p>
          ) : (
             <ul className="space-y-2">
              {returns.slice(0,5).map(r => {
                const sub = subcontractorOptions.find(s => s.id === r.subcontractorId);
                return (
                  <li key={r.id} className="text-sm p-2 border rounded-md bg-muted/50">
                    {r.quantity} units from {r.subcontractorName || r.subcontractorId}
                    {sub ? ` (${sub.dnrCapacity.toUpperCase()})` : ''}, Status: {r.qualityStatus}, on {new Date(r.returnDate).toLocaleDateString()}
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

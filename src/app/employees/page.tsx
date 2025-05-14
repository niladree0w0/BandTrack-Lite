
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { placeholderInHouseEmployees, placeholderSubcontractors } from "@/lib/placeholder-data";
import type { InHouseEmployee, Subcontractor, DnrCapacity } from "@/lib/definitions";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog";
import { useToast } from "@/hooks/use-toast";

export default function EmployeesPage() {
  const [inHouseEmployees, setInHouseEmployees] = useState<InHouseEmployee[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setInHouseEmployees(placeholderInHouseEmployees);
    setSubcontractors(placeholderSubcontractors);
  }, []);

  const generateId = (prefix: string, timestamp: number) => `${prefix}-${timestamp}`;

  const handleSaveEmployee = (personData: Omit<InHouseEmployee, "id"> | (Omit<Subcontractor, "id" | "dnrCapacity"> & { dnrCapacity: DnrCapacity })) => {
    const timestamp = Date.now();

    if ('dnrCapacity' in personData) { // It's a Subcontractor (form data)
      const subcontractorData = personData as (Omit<Subcontractor, "id" | "dnrCapacity"> & { dnrCapacity: DnrCapacity });
      
      if (subcontractorData.dnrCapacity === "both") {
        const sub300: Subcontractor = {
          ...subcontractorData,
          id: generateId('3', timestamp),
          dnrCapacity: '300dnr', 
        };
        const sub600: Subcontractor = {
          ...subcontractorData,
          id: generateId('6', timestamp + 1), // Ensure unique timestamp for key if added fast
          dnrCapacity: '600dnr',
        };
        setSubcontractors(prev => [sub300, sub600, ...prev]);
        toast({
          title: "Subcontractor Added (Both Capacities)",
          description: `${subcontractorData.name} has been added for both 300dnr and 600dnr capacities.`,
        });
      } else {
        let prefix = 'S'; // Default for 'none'
        if (subcontractorData.dnrCapacity === '300dnr') prefix = '3';
        if (subcontractorData.dnrCapacity === '600dnr') prefix = '6';
        
        const newSubcontractor: Subcontractor = {
          ...subcontractorData,
          id: generateId(prefix, timestamp),
          // dnrCapacity is already '300dnr', '600dnr', or 'none' from the form
          dnrCapacity: subcontractorData.dnrCapacity as "300dnr" | "600dnr" | "none",
        };
        setSubcontractors(prev => [newSubcontractor, ...prev]);
        toast({
          title: "Subcontractor Added",
          description: `${newSubcontractor.name} has been added with ${newSubcontractor.dnrCapacity} capacity.`,
        });
      }
    } else { // It's an In-House Employee
      const newEmployee: InHouseEmployee = {
        ...personData,
        id: generateId('emp', timestamp),
      };
      setInHouseEmployees(prev => [newEmployee, ...prev]);
      toast({
        title: "In-House Employee Added",
        description: `${newEmployee.name} has been added to the roster.`,
      });
    }
    setIsAddDialogOpen(false);
  };
  
  const renderSubcontractorTable = (title: string, capacityFilter: "300dnr" | "600dnr" | "none") => {
    const filteredSubcontractors = subcontractors.filter(s => s.dnrCapacity === capacityFilter);
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Work Type</TableHead>
                <TableHead>Phone Number</TableHead>
                {capacityFilter === "none" && <TableHead>DNR Capacity</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubcontractors.length > 0 ? (
                filteredSubcontractors.map((subcontractor) => (
                  <TableRow key={subcontractor.id}>
                    <TableCell>{subcontractor.id}</TableCell>
                    <TableCell className="font-medium">{subcontractor.name}</TableCell>
                    <TableCell>{subcontractor.workType}</TableCell>
                    <TableCell>{subcontractor.contact}</TableCell>
                    {capacityFilter === "none" && 
                      <TableCell>
                        <Badge variant={subcontractor.dnrCapacity === "none" ? "outline" : "secondary"}>
                          {subcontractor.dnrCapacity.toUpperCase()}
                        </Badge>
                      </TableCell>
                    }
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={capacityFilter === "none" ? 5 : 4} className="text-center text-muted-foreground">
                    No subcontractors found for this capacity.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Employee & Subcontractor Roster"
        description="Manage in-house employees and subcontractors by DNR capacity."
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Personnel
          </Button>
        }
      />
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>In-House Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Work Type</TableHead>
                <TableHead>Phone Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inHouseEmployees.length > 0 ? (
                inHouseEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.workType}</TableCell>
                    <TableCell>{employee.contact}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No in-house employees found. Click "Add New" to add one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {renderSubcontractorTable("Subcontractors (300dnr Capacity)", "300dnr")}
      {renderSubcontractorTable("Subcontractors (600dnr Capacity)", "600dnr")}
      {renderSubcontractorTable("Subcontractors (No Specific DNR Capacity)", "none")}

      <AddEmployeeDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}

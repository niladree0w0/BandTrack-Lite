
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
import type { InHouseEmployee, Subcontractor } from "@/lib/definitions";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog";
import { useToast } from "@/hooks/use-toast";

// Metadata should be handled in a parent layout or a dedicated metadata export if this remains a client component.
// export const metadata: Metadata = {
//   title: 'Employee & Subcontractor Roster',
// };

export default function EmployeesPage() {
  const [inHouseEmployees, setInHouseEmployees] = useState<InHouseEmployee[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching initial data
    setInHouseEmployees(placeholderInHouseEmployees);
    setSubcontractors(placeholderSubcontractors);
  }, []);

  const handleSaveEmployee = (person: InHouseEmployee | Subcontractor) => {
    const newId = `emp${Date.now()}`; // Simple ID generation
    if ('dnrCapacity' in person) { // It's a Subcontractor
      setSubcontractors(prev => [{ ...person, id: newId }, ...prev]);
      toast({
        title: "Subcontractor Added",
        description: `${person.name} has been added to the roster.`,
      });
    } else { // It's an In-House Employee
      setInHouseEmployees(prev => [{ ...person, id: newId }, ...prev]);
      toast({
        title: "In-House Employee Added",
        description: `${person.name} has been added to the roster.`,
      });
    }
    setIsAddDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Employee & Subcontractor Roster"
        description="Manage your lists of in-house employees and subcontractors, including their DNR capacities."
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New
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
                <TableHead>Name</TableHead>
                <TableHead>Work Type</TableHead>
                <TableHead>Contact Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inHouseEmployees.length > 0 ? (
                inHouseEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.workType}</TableCell>
                    <TableCell>{employee.contact}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No in-house employees found. Click "Add New" to add one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Subcontractors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Work Type</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>DNR Capacity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcontractors.length > 0 ? (
                subcontractors.map((subcontractor) => (
                  <TableRow key={subcontractor.id}>
                    <TableCell className="font-medium">{subcontractor.name}</TableCell>
                    <TableCell>{subcontractor.workType}</TableCell>
                    <TableCell>{subcontractor.contact}</TableCell>
                    <TableCell>
                      <Badge variant={subcontractor.dnrCapacity === "none" ? "outline" : "secondary"}>
                        {subcontractor.dnrCapacity.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No subcontractors found. Click "Add New" to add one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddEmployeeDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}

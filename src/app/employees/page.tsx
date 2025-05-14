
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
import { PersonnelDetailDialog } from "@/components/employees/PersonnelDetailDialog";
import { useToast } from "@/hooks/use-toast";

export default function EmployeesPage() {
  const [inHouseEmployees, setInHouseEmployees] = useState<InHouseEmployee[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<InHouseEmployee | Subcontractor | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setInHouseEmployees(placeholderInHouseEmployees);
    setSubcontractors(placeholderSubcontractors);
  }, []);

  const handleRowClick = (person: InHouseEmployee | Subcontractor) => {
    setSelectedPersonnel(person);
    setIsDetailDialogOpen(true);
  };

  const handleSaveEmployee = (personData: Omit<InHouseEmployee, "id"> | (Omit<Subcontractor, "id" | "dnrCapacity"> & { dnrCapacity: DnrCapacity })) => {
    if ('dnrCapacity' in personData) { // It's a Subcontractor
      const subcontractorData = personData as (Omit<Subcontractor, "id" | "dnrCapacity"> & { dnrCapacity: DnrCapacity });
      
      const addSub = (capacity: "300dnr" | "600dnr" | "none") => {
        let newId: string;
        if (capacity === '300dnr') {
          const maxId = Math.max(0, ...subcontractors.filter(s => s.id.startsWith('3') && !s.id.startsWith('S')).map(s => parseInt(s.id) || 0));
          newId = `${maxId === 0 ? 301 : maxId + 1}`;
        } else if (capacity === '600dnr') {
          const maxId = Math.max(0, ...subcontractors.filter(s => s.id.startsWith('6') && !s.id.startsWith('S')).map(s => parseInt(s.id) || 0));
          newId = `${maxId === 0 ? 601 : maxId + 1}`;
        } else { // 'none'
          const maxId = Math.max(0, ...subcontractors.filter(s => s.id.startsWith('S')).map(s => parseInt(s.id.substring(1)) || 0));
          newId = `S${maxId === 0 ? 101 : maxId + 1}`;
        }
        
        const newSub: Subcontractor = {
          ...subcontractorData,
          id: newId,
          dnrCapacity: capacity,
        };
        setSubcontractors(prev => [newSub, ...prev]);
        return newSub;
      };

      if (subcontractorData.dnrCapacity === "both") {
        const sub300 = addSub('300dnr');
        const sub600 = addSub('600dnr');
        toast({
          title: "Subcontractor Added (Both Capacities)",
          description: `${subcontractorData.name} added as ${sub300.id} (300dnr) and ${sub600.id} (600dnr).`,
        });
      } else {
        const newSub = addSub(subcontractorData.dnrCapacity as "300dnr" | "600dnr" | "none");
        toast({
          title: "Subcontractor Added",
          description: `${newSub.name} (${newSub.id}) has been added with ${newSub.dnrCapacity} capacity.`,
        });
      }
    } else { // It's an In-House Employee
      const maxId = Math.max(0, ...inHouseEmployees.map(e => parseInt(e.id.replace('emp', '')) || 0));
      const newEmployeeId = `emp${maxId === 0 ? 101 : maxId + 1}`;
      const newEmployee: InHouseEmployee = {
        ...personData,
        id: newEmployeeId,
      };
      setInHouseEmployees(prev => [newEmployee, ...prev]);
      toast({
        title: "In-House Employee Added",
        description: `${newEmployee.name} (${newEmployee.id}) has been added to the roster.`,
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
                <TableHead>Phone Number</TableHead>
                {capacityFilter === "none" && <TableHead>DNR Capacity</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubcontractors.length > 0 ? (
                filteredSubcontractors.map((subcontractor) => (
                  <TableRow key={subcontractor.id} onClick={() => handleRowClick(subcontractor)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>{subcontractor.id}</TableCell>
                    <TableCell className="font-medium">{subcontractor.name}</TableCell>
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
                  <TableCell colSpan={capacityFilter === "none" ? 4 : 3} className="text-center text-muted-foreground">
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
                  <TableRow key={employee.id} onClick={() => handleRowClick(employee)} className="cursor-pointer hover:bg-muted/50">
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
      <PersonnelDetailDialog
        person={selectedPersonnel}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  );
}


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
import type { InHouseEmployee, Subcontractor, DnrCapacity, BaseEmployee } from "@/lib/definitions";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddEmployeeDialog, type PersonnelFormValues } from "@/components/employees/add-employee-dialog";
import { PersonnelDetailDialog } from "@/components/employees/PersonnelDetailDialog";
import { DeleteConfirmationDialog } from "@/components/employees/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";

export default function EmployeesPage() {
  const [inHouseEmployees, setInHouseEmployees] = useState<InHouseEmployee[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  
  const [isAddOrEditDialogOpen, setIsAddOrEditDialogOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<PersonnelFormValues | undefined>(undefined);

  const [selectedPersonnelDetail, setSelectedPersonnelDetail] = useState<InHouseEmployee | Subcontractor | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const [personToDelete, setPersonToDelete] = useState<InHouseEmployee | Subcontractor | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    setInHouseEmployees(placeholderInHouseEmployees);
    setSubcontractors(placeholderSubcontractors);
  }, []);

  const handleRowClick = (person: InHouseEmployee | Subcontractor) => {
    setSelectedPersonnelDetail(person);
    setIsDetailDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingPersonnel(undefined); // Clear any editing state
    setIsAddOrEditDialogOpen(true);
  };

  const handleEditClick = (person: InHouseEmployee | Subcontractor) => {
    const personType = 'dnrCapacity' in person ? 'subcontractor' : 'inHouse';
    setEditingPersonnel({
      id: person.id,
      name: person.name,
      workType: person.workType,
      contact: person.contact,
      personType: personType,
      ... (personType === 'subcontractor' && { dnrCapacity: (person as Subcontractor).dnrCapacity })
    });
    setIsAddOrEditDialogOpen(true);
  };

  const handleDeleteClick = (person: InHouseEmployee | Subcontractor) => {
    setPersonToDelete(person);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!personToDelete) return;

    if ('dnrCapacity' in personToDelete) { // It's a Subcontractor
      setSubcontractors(prev => prev.filter(s => s.id !== personToDelete.id));
      toast({
        title: "Subcontractor Deleted",
        description: `${personToDelete.name} (${personToDelete.id}) has been removed.`,
        variant: "destructive"
      });
    } else { // It's an In-House Employee
      setInHouseEmployees(prev => prev.filter(e => e.id !== personToDelete.id));
      toast({
        title: "In-House Employee Deleted",
        description: `${personToDelete.name} (${personToDelete.id}) has been removed.`,
        variant: "destructive"
      });
    }
    setIsConfirmDeleteDialogOpen(false);
    setPersonToDelete(null);
  };

  const generateNewSubId = (capacity: "300dnr" | "600dnr" | "none", currentSubs: Subcontractor[]): string => {
    let prefix: string;
    let numericPartBase: number;
    let filterFn: (s: Subcontractor) => boolean;

    if (capacity === '300dnr') {
      prefix = '';
      numericPartBase = 300;
      filterFn = s => s.id.startsWith('3') && !s.id.startsWith('S') && parseInt(s.id, 10) >= 300 && parseInt(s.id, 10) < 400;
    } else if (capacity === '600dnr') {
      prefix = '';
      numericPartBase = 600;
      filterFn = s => s.id.startsWith('6') && !s.id.startsWith('S') && parseInt(s.id, 10) >= 600 && parseInt(s.id, 10) < 700;
    } else { // 'none'
      prefix = 'S';
      numericPartBase = 100;
      filterFn = s => s.id.startsWith('S');
    }
    
    const relevantIds = currentSubs
      .filter(filterFn)
      .map(s => parseInt(s.id.replace(prefix, ''), 10))
      .filter(n => !isNaN(n));

    const maxIdNum = Math.max(0, ...relevantIds);
    return `${prefix}${maxIdNum === 0 ? numericPartBase + 1 : maxIdNum + 1}`;
  };
  
  const handleSavePersonnel = (formData: PersonnelFormValues) => {
    const isEditMode = !!formData.id;

    if (formData.personType === "inHouse") {
      const employeeData = { name: formData.name, workType: formData.workType, contact: formData.contact };
      if (isEditMode && formData.id) {
        setInHouseEmployees(prev => prev.map(e => e.id === formData.id ? { ...e, ...employeeData } : e));
        toast({ title: "Employee Updated", description: `${formData.name} (${formData.id}) details updated.` });
      } else {
        const maxId = Math.max(0, ...inHouseEmployees.map(e => parseInt(e.id.replace('emp', '')) || 0));
        const newId = `emp${maxId === 0 ? 101 : maxId + 1}`;
        setInHouseEmployees(prev => [{ ...employeeData, id: newId }, ...prev]);
        toast({ title: "In-House Employee Added", description: `${formData.name} (${newId}) added.` });
      }
    } else if (formData.personType === "subcontractor" && formData.dnrCapacity) {
      // Subcontractor logic
      const subcontractorBaseData = { name: formData.name, workType: formData.workType, contact: formData.contact };

      if (isEditMode && formData.id) {
        // Editing existing subcontractor
        const originalSub = subcontractors.find(s => s.id === formData.id);
        if (!originalSub) return; // Should not happen

        const newCapacity = formData.dnrCapacity;
        const oldCapacity = originalSub.dnrCapacity;

        if (newCapacity === "both") { // Changing to "both" from a specific or none
            setSubcontractors(prev => {
                let subs = prev.filter(s => s.id !== formData.id); // Remove old entry
                const sub300Id = (oldCapacity === '300dnr' || oldCapacity === '600dnr' && newCapacity === 'both' && originalSub.id.startsWith('3')) ? formData.id! : generateNewSubId('300dnr', subs);
                const sub600Id = (oldCapacity === '600dnr' || oldCapacity === '300dnr' && newCapacity === 'both' && originalSub.id.startsWith('6')) ? formData.id! : generateNewSubId('600dnr', subs);
                
                const newSub300: Subcontractor = { ...subcontractorBaseData, id: sub300Id, dnrCapacity: '300dnr' };
                const newSub600: Subcontractor = { ...subcontractorBaseData, id: sub600Id, dnrCapacity: '600dnr' };
                
                subs.push(newSub300);
                if (!subs.find(s => s.id === newSub600.id)) subs.push(newSub600); // Avoid duplicate if ID somehow matched
                
                // Ensure original entry is updated if one of the new IDs matches the old ID
                if (newSub300.id !== formData.id && newSub600.id !== formData.id) {
                     // if neither matches, it means we are effectively creating two new ones, and old one is filtered out.
                } else if (newSub300.id === formData.id) {
                    // original was 300dnr, now also adding 600dnr
                } else if (newSub600.id === formData.id) {
                    // original was 600dnr, now also adding 300dnr
                }
                
                return subs;
            });
            toast({ title: "Subcontractor Updated (Both Capacities)", description: `${formData.name} updated to handle both 300dnr & 600dnr.` });

        } else { // Changing to a specific capacity ('300dnr', '600dnr', 'none')
            const requiresNewId = 
                (newCapacity === '300dnr' && !formData.id.startsWith('3')) ||
                (newCapacity === '600dnr' && !formData.id.startsWith('6')) ||
                (newCapacity === 'none' && !formData.id.startsWith('S'));

            if (requiresNewId) {
                const newId = generateNewSubId(newCapacity, subcontractors.filter(s => s.id !== formData.id));
                setSubcontractors(prev => [
                    ...prev.filter(s => s.id !== formData.id),
                    { ...subcontractorBaseData, id: newId, dnrCapacity: newCapacity }
                ]);
                toast({ title: "Subcontractor Updated", description: `${formData.name} (${newId}) updated to ${newCapacity}. Old ID ${formData.id} removed.` });
            } else {
                 // ID prefix matches new capacity or capacity type (e.g. 300dnr) hasn't changed type
                setSubcontractors(prev => prev.map(s => s.id === formData.id ? { ...s, ...subcontractorBaseData, dnrCapacity: newCapacity } : s));
                toast({ title: "Subcontractor Updated", description: `${formData.name} (${formData.id}) details updated.` });
            }
        }

      } else { // Adding new subcontractor
        const addSub = (capacity: "300dnr" | "600dnr" | "none") => {
          const newId = generateNewSubId(capacity, subcontractors);
          const newSub: Subcontractor = { ...subcontractorBaseData, id: newId, dnrCapacity: capacity };
          setSubcontractors(prev => [newSub, ...prev]);
          return newSub;
        };

        if (formData.dnrCapacity === "both") {
          const sub300 = addSub('300dnr');
          const sub600 = addSub('600dnr');
          toast({ title: "Subcontractor Added (Both)", description: `${formData.name} added as ${sub300.id} (300dnr) and ${sub600.id} (600dnr).` });
        } else {
          const newSub = addSub(formData.dnrCapacity as "300dnr" | "600dnr" | "none"); // Cast because "both" is handled
          toast({ title: "Subcontractor Added", description: `${newSub.name} (${newSub.id}) added with ${newSub.dnrCapacity}.` });
        }
      }
    }
    setIsAddOrEditDialogOpen(false);
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubcontractors.length > 0 ? (
                filteredSubcontractors.map((subcontractor) => (
                  <TableRow key={subcontractor.id} >
                    <TableCell onClick={() => handleRowClick(subcontractor)} className="cursor-pointer hover:underline">{subcontractor.id}</TableCell>
                    <TableCell onClick={() => handleRowClick(subcontractor)} className="font-medium cursor-pointer hover:underline">{subcontractor.name}</TableCell>
                    <TableCell onClick={() => handleRowClick(subcontractor)} className="cursor-pointer hover:underline">{subcontractor.contact}</TableCell>
                    {capacityFilter === "none" && 
                      <TableCell onClick={() => handleRowClick(subcontractor)} className="cursor-pointer hover:underline">
                        <Badge variant={subcontractor.dnrCapacity === "none" ? "outline" : "secondary"}>
                          {subcontractor.dnrCapacity.toUpperCase()}
                        </Badge>
                      </TableCell>
                    }
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(subcontractor)} className="mr-2">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(subcontractor)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
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
          <Button onClick={handleAddNewClick}>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inHouseEmployees.length > 0 ? (
                inHouseEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell onClick={() => handleRowClick(employee)} className="cursor-pointer hover:underline">{employee.id}</TableCell>
                    <TableCell onClick={() => handleRowClick(employee)} className="font-medium cursor-pointer hover:underline">{employee.name}</TableCell>
                    <TableCell onClick={() => handleRowClick(employee)} className="cursor-pointer hover:underline">{employee.workType}</TableCell>
                    <TableCell onClick={() => handleRowClick(employee)} className="cursor-pointer hover:underline">{employee.contact}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={() => handleEditClick(employee)} className="mr-2">
                        <Pencil className="h-4 w-4" />
                         <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(employee)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
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
        open={isAddOrEditDialogOpen} 
        onOpenChange={setIsAddOrEditDialogOpen}
        onSave={handleSavePersonnel}
        initialData={editingPersonnel}
      />
      <PersonnelDetailDialog
        person={selectedPersonnelDetail}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
        onConfirm={confirmDelete}
        personName={personToDelete?.name}
        itemType={personToDelete && 'dnrCapacity' in personToDelete ? 'subcontractor' : 'employee'}
      />
    </div>
  );
}

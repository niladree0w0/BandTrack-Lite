
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
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions"; // Updated import

export default function EmployeesPage() {
  const { user } = useAuth(); // useAuth now provides user with permissions
  const [inHouseEmployees, setInHouseEmployees] = useState<InHouseEmployee[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  
  const [isAddOrEditDialogOpen, setIsAddOrEditDialogOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<PersonnelFormValues | undefined>(undefined);

  const [selectedPersonnelDetail, setSelectedPersonnelDetail] = useState<InHouseEmployee | Subcontractor | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const [personToDelete, setPersonToDelete] = useState<InHouseEmployee | Subcontractor | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const canView = user && hasPermission(user, 'viewEmployees');
  const canManage = user && hasPermission(user, 'manageEmployees');

  useEffect(() => {
    setInHouseEmployees(placeholderInHouseEmployees);
    setSubcontractors(placeholderSubcontractors);
  }, []);

  const handleRowClick = (person: InHouseEmployee | Subcontractor) => {
    setSelectedPersonnelDetail(person);
    setIsDetailDialogOpen(true);
  };

  const handleAddNewClick = () => {
    if (!canManage) return;
    setEditingPersonnel(undefined); 
    setIsAddOrEditDialogOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, person: InHouseEmployee | Subcontractor) => {
    e.stopPropagation(); 
    if (!canManage) return;
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

  const handleDeleteClick = (e: React.MouseEvent, person: InHouseEmployee | Subcontractor) => {
    e.stopPropagation(); 
    if (!canManage) return;
    setPersonToDelete(person);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!personToDelete || !canManage) return;

    if ('dnrCapacity' in personToDelete) { 
      setSubcontractors(prev => prev.filter(s => s.id !== personToDelete.id));
      toast({
        title: "Subcontractor Deleted",
        description: `${personToDelete.name} (${personToDelete.id}) has been removed.`,
        variant: "destructive"
      });
    } else { 
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
      filterFn = s => /^\d+$/.test(s.id) && parseInt(s.id, 10) >= 300 && parseInt(s.id, 10) < 400;
    } else if (capacity === '600dnr') {
      prefix = '';
      numericPartBase = 600;
      filterFn = s => /^\d+$/.test(s.id) && parseInt(s.id, 10) >= 600 && parseInt(s.id, 10) < 700;
    } else { 
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
    if (!canManage) return;
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
      const subcontractorBaseData = { name: formData.name, workType: formData.workType, contact: formData.contact };

      if (isEditMode && formData.id) {
        const originalSub = subcontractors.find(s => s.id === formData.id);
        if (!originalSub) return; 

        const newCapacity = formData.dnrCapacity;
        
        if (newCapacity === "both") { 
            setSubcontractors(prev => {
                let subs = prev.filter(s => s.id !== formData.id && !(s.name === originalSub.name && s.contact === originalSub.contact && (s.dnrCapacity === '300dnr' || s.dnrCapacity === '600dnr')));
                
                const sub300Id = (originalSub.dnrCapacity === '300dnr' || (originalSub.dnrCapacity === '600dnr' && (originalSub.id.startsWith('3') || /^\d+$/.test(originalSub.id) && parseInt(originalSub.id, 10) >= 300 && parseInt(originalSub.id, 10) < 400 ) )) ? formData.id! : generateNewSubId('300dnr', subs);
                const sub600Id = (originalSub.dnrCapacity === '600dnr' || (originalSub.dnrCapacity === '300dnr' && (originalSub.id.startsWith('6') || /^\d+$/.test(originalSub.id) && parseInt(originalSub.id, 10) >= 600 && parseInt(originalSub.id, 10) < 700 ) )) ? formData.id! : generateNewSubId('600dnr', subs);
                
                const newSub300: Subcontractor = { ...subcontractorBaseData, id: sub300Id, dnrCapacity: '300dnr' };
                const newSub600: Subcontractor = { ...subcontractorBaseData, id: sub600Id, dnrCapacity: '600dnr' };
                
                if (!subs.find(s => s.id === newSub300.id)) subs.push(newSub300);
                else subs = subs.map(s => s.id === newSub300.id ? newSub300 : s);

                if (!subs.find(s => s.id === newSub600.id)) subs.push(newSub600);
                else subs = subs.map(s => s.id === newSub600.id ? newSub600 : s);
                
                return subs.sort((a,b) => a.id.localeCompare(b.id));
            });
            toast({ title: "Subcontractor Updated (Both Capacities)", description: `${formData.name} updated to handle both 300dnr & 600dnr.` });

        } else { 
            const is300Id = (id: string) => /^\d+$/.test(id) && parseInt(id,10) >= 300 && parseInt(id,10) < 400;
            const is600Id = (id: string) => /^\d+$/.test(id) && parseInt(id,10) >= 600 && parseInt(id,10) < 700;
            const isSId = (id: string) => id.startsWith('S');

            const requiresNewId = 
                (newCapacity === '300dnr' && !is300Id(formData.id!)) ||
                (newCapacity === '600dnr' && !is600Id(formData.id!)) ||
                (newCapacity === 'none' && !isSId(formData.id!));

            if (requiresNewId) {
                const newId = generateNewSubId(newCapacity, subcontractors.filter(s => s.id !== formData.id));
                setSubcontractors(prev => [
                    ...prev.filter(s => s.id !== formData.id),
                    { ...subcontractorBaseData, id: newId, dnrCapacity: newCapacity }
                ].sort((a,b) => a.id.localeCompare(b.id)));
                toast({ title: "Subcontractor Updated", description: `${formData.name} (${newId}) updated to ${newCapacity}. Old ID ${formData.id} removed.` });
            } else {
                setSubcontractors(prev => prev.map(s => s.id === formData.id ? { ...s, ...subcontractorBaseData, dnrCapacity: newCapacity } : s).sort((a,b) => a.id.localeCompare(b.id)));
                toast({ title: "Subcontractor Updated", description: `${formData.name} (${formData.id}) details updated.` });
            }
        }

      } else { 
        const addSub = (capacity: "300dnr" | "600dnr" | "none") => {
          const newId = generateNewSubId(capacity, subcontractors);
          const newSub: Subcontractor = { ...subcontractorBaseData, id: newId, dnrCapacity: capacity };
          setSubcontractors(prev => [newSub, ...prev].sort((a,b) => a.id.localeCompare(b.id)));
          return newSub;
        };

        if (formData.dnrCapacity === "both") {
          const sub300 = addSub('300dnr');
          const sub600 = addSub('600dnr');
          toast({ title: "Subcontractor Added (Both)", description: `${formData.name} added as ${sub300.id} (300dnr) and ${sub600.id} (600dnr).` });
        } else {
          const newSub = addSub(formData.dnrCapacity as "300dnr" | "600dnr" | "none");
          toast({ title: "Subcontractor Added", description: `${newSub.name} (${newSub.id}) added with ${newSub.dnrCapacity}.` });
        }
      }
    }
    setIsAddOrEditDialogOpen(false);
  };
  
  const renderSubcontractorTable = (title: string, capacityFilter: "300dnr" | "600dnr" | "none") => {
    const filteredSubcontractors = subcontractors.filter(s => s.dnrCapacity === capacityFilter);
    const colCount = canManage ? 4 : 3; // Adjusted based on presence of 'Actions' column
    if (capacityFilter === "none" && canManage) { // No DNR Capacity column if already filtered by 'none'
        // colCount = canManage ? 4 : 3;
    } else if (capacityFilter === "none" && !canManage) {
        // colCount = 3;
    }


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
                {/* DNR Capacity column is only shown for "No Specific DNR Capacity" table or if needed */}
                {capacityFilter === "none" && <TableHead>DNR Capacity</TableHead>}
                {canManage && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubcontractors.length > 0 ? (
                filteredSubcontractors.map((subcontractor) => (
                  <TableRow key={subcontractor.id} onClick={() => handleRowClick(subcontractor)} className="cursor-pointer">
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
                    {canManage && (
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={(e) => handleEditClick(e, subcontractor)} className="mr-2">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => handleDeleteClick(e, subcontractor)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={capacityFilter === "none" ? (canManage ? 5 : 4) : (canManage ? 4 : 3) } 
                    className="text-center text-muted-foreground"
                  >
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

  if (!canView) { // Check for 'viewEmployees' permission
     return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Employee & Subcontractor Roster"
                description="You do not have permission to view this page."
            />
            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground">Please contact an administrator if you believe this is an error.</p>
                </CardContent>
            </Card>
        </div>
     );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Employee & Subcontractor Roster"
        description="Manage in-house employees and subcontractors by DNR capacity."
        actions={
          canManage ? ( // Check for 'manageEmployees' permission for Add button
            <Button onClick={handleAddNewClick}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Personnel
            </Button>
          ) : null
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
                {canManage && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {inHouseEmployees.length > 0 ? (
                inHouseEmployees.map((employee) => (
                  <TableRow key={employee.id} onClick={() => handleRowClick(employee)} className="cursor-pointer">
                    <TableCell>{employee.id}</TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.workType}</TableCell>
                    <TableCell>{employee.contact}</TableCell>
                    {canManage && (
                      <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={(e) => handleEditClick(e, employee)} className="mr-2">
                        <Pencil className="h-4 w-4" />
                         <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => handleDeleteClick(e, employee)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={canManage ? 5 : 4} className="text-center text-muted-foreground">
                    No in-house employees found. {canManage ? 'Click "Add New Personnel" to add one.' : ''}
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

      {canManage && (
        <AddEmployeeDialog 
          open={isAddOrEditDialogOpen} 
          onOpenChange={setIsAddOrEditDialogOpen}
          onSave={handleSavePersonnel}
          initialData={editingPersonnel}
        />
      )}
      <PersonnelDetailDialog
        person={selectedPersonnelDetail}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
      {canManage && (
        <DeleteConfirmationDialog
          open={isConfirmDeleteDialogOpen}
          onOpenChange={setIsConfirmDeleteDialogOpen}
          onConfirm={confirmDelete}
          personName={personToDelete?.name}
          itemType={personToDelete && 'dnrCapacity' in personToDelete ? 'subcontractor' : 'employee'}
        />
      )}
    </div>
  );
}

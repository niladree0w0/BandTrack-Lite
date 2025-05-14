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
import { placeholderEmployees } from "@/lib/placeholder-data";
import type { Employee } from "@/lib/definitions";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employee Roster',
};

export default async function EmployeesPage() {
  // In a real app, fetch employees from a database or API
  const employees: Employee[] = placeholderEmployees;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Employee Roster"
        description="Manage your list of subcontractors and in-house employees."
        actions={
          <Button disabled> {/* Add functionality later */}
            <UserPlus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        }
      />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Employee & Subcontractor List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Work Type</TableHead>
                <TableHead>Contact Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>
                      <Badge variant={employee.type === "Subcontractor" ? "secondary" : "outline"}>
                        {employee.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{employee.workType}</TableCell>
                    <TableCell>{employee.contact}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No employees or subcontractors found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

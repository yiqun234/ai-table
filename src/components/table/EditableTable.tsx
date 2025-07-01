'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export function EditableTable() {
  const [rowCount, setRowCount] = useState(3);

  function handleAddRow() {
    setRowCount(rowCount + 1);
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[50px] w-[50px] text-center">#</TableHead>
            <TableHead>Context</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-center">{index + 1}</TableCell>
              <TableCell>...</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-4">
        <Button variant="ghost" className="mt-2" onClick={handleAddRow}>
          <Plus className="h-4 w-4 mr-2" />
          Add Row
        </Button>
      </div>
    </div>
  );
} 
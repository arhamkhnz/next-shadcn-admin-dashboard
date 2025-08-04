import React from "react";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Booking } from "@/types/franchise";

interface PendingBookingsTableProps {
  bookings: Booking[];
}

const PendingBookingsTable: React.FC<PendingBookingsTableProps> = ({ bookings }) => {
  const pending = bookings.filter((b) => b.status === "pending");

  return (
    <Table>
      <TableCaption>Pending bookings requiring approval or action</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Booking ID</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pending.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="muted-foreground text-center">
              No pending bookings
            </TableCell>
          </TableRow>
        ) : (
          pending.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.id}</TableCell>
              <TableCell>{b.user}</TableCell>
              <TableCell>{b.branch}</TableCell>
              <TableCell>{b.service}</TableCell>
              <TableCell>{b.date ? new Date(b.date).toLocaleString() : "-"}</TableCell>
              <TableCell>
                <span className="rounded bg-yellow-100 px-2 py-1 text-yellow-800 capitalize dark:bg-yellow-900 dark:text-yellow-200">
                  {b.status}
                </span>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default PendingBookingsTable;

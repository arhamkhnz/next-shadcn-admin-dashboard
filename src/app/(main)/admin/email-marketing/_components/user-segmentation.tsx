/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines */

"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const mockSegments = [
  { id: "1", name: "All Users", criteria: "All registered users", count: 12450 },
  { id: "2", name: "Active Customers", criteria: "Booked in last 30 days", count: 8700 },
  { id: "3", name: "New Users", criteria: "Registered in last 30 days", count: 1200 },
  { id: "4", name: "High Value", criteria: "Spent over $200", count: 2100 },
  { id: "5", name: "Inactive", criteria: "No bookings in 90 days", count: 3450 },
];

const mockUsers = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    bookings: 12,
    totalSpent: 245,
    lastBooking: "2024-06-15",
  },
  { id: "2", name: "Fatima Ali", email: "fatima@example.com", bookings: 8, totalSpent: 180, lastBooking: "2024-06-10" },
  { id: "3", name: "Omar Khalid", email: "omar@example.com", bookings: 15, totalSpent: 320, lastBooking: "2024-06-18" },
  {
    id: "4",
    name: "Layla Mahmoud",
    email: "layla@example.com",
    bookings: 5,
    totalSpent: 95,
    lastBooking: "2024-05-22",
  },
  {
    id: "5",
    name: "Youssef Salem",
    email: "youssef@example.com",
    bookings: 22,
    totalSpent: 480,
    lastBooking: "2024-06-19",
  },
];

export function UserSegmentation() {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [segmentDescription, setSegmentDescription] = useState("");
  const [criteria, setCriteria] = useState({
    location: "",
    bookingCount: "",
    spending: "",
    lastBooking: "",
  });

  const handleCreateSegment = () => {
    // In a real app, this would create a new segment
    console.log("Creating segment:", { segmentName, segmentDescription, criteria });
    setIsCreateDialogOpen(false);
    setSegmentName("");
    setSegmentDescription("");
    setCriteria({
      location: "",
      bookingCount: "",
      spending: "",
      lastBooking: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Segmentation</CardTitle>
            <CardDescription>Create and manage user segments for targeted campaigns</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Segment</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Segment</DialogTitle>
                <DialogDescription>Define criteria to create a targeted user segment</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="segmentName" className="text-right">
                    Segment Name
                  </Label>
                  <Input
                    id="segmentName"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., High Value Customers"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="segmentDescription" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="segmentDescription"
                    value={segmentDescription}
                    onChange={(e) => setSegmentDescription(e.target.value)}
                    className="col-span-3"
                    placeholder="Describe this segment"
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Select
                    value={criteria.location}
                    onValueChange={(value) => setCriteria({ ...criteria, location: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="erbil">Erbil</SelectItem>
                      <SelectItem value="baghdad">Baghdad</SelectItem>
                      <SelectItem value="basra">Basra</SelectItem>
                      <SelectItem value="mosul">Mosul</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bookingCount" className="text-right">
                    Booking Count
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Select>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gt">Greater than</SelectItem>
                        <SelectItem value="lt">Less than</SelectItem>
                        <SelectItem value="eq">Equal to</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="bookingCount"
                      type="number"
                      value={criteria.bookingCount}
                      onChange={(e) => setCriteria({ ...criteria, bookingCount: e.target.value })}
                      placeholder="Number of bookings"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="spending" className="text-right">
                    Total Spending
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Select>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gt">Greater than</SelectItem>
                        <SelectItem value="lt">Less than</SelectItem>
                        <SelectItem value="eq">Equal to</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="spending"
                      type="number"
                      value={criteria.spending}
                      onChange={(e) => setCriteria({ ...criteria, spending: e.target.value })}
                      placeholder="Amount in USD"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastBooking" className="text-right">
                    Last Booking
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Select>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gt">Within</SelectItem>
                        <SelectItem value="lt">Before</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="lastBooking"
                      type="number"
                      value={criteria.lastBooking}
                      onChange={(e) => setCriteria({ ...criteria, lastBooking: e.target.value })}
                      placeholder="Days"
                    />
                    <span>days</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSegment}>Create Segment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-medium">Segments</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Criteria</TableHead>
                  <TableHead>Users</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSegments.map((segment) => (
                  <TableRow
                    key={segment.id}
                    className={selectedSegment === segment.id ? "bg-muted" : ""}
                    onClick={() => setSelectedSegment(segment.id)}
                  >
                    <TableCell className="font-medium">{segment.name}</TableCell>
                    <TableCell>{segment.criteria}</TableCell>
                    <TableCell>{segment.count.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">
              {selectedSegment ? mockSegments.find((s) => s.id === selectedSegment)?.name : "Select a segment"}
            </h3>
            {selectedSegment ? (
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">Segment Details</h4>
                    <Badge variant="secondary">
                      {mockSegments.find((s) => s.id === selectedSegment)?.count.toLocaleString()} users
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {mockSegments.find((s) => s.id === selectedSegment)?.criteria}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Sample Users</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Bookings</TableHead>
                        <TableHead>Spent</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-muted-foreground text-sm">{user.email}</div>
                          </TableCell>
                          <TableCell>{user.bookings}</TableCell>
                          <TableCell>${user.totalSpent}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Edit Segment</Button>
                  <Button variant="outline">Delete Segment</Button>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed p-8 text-center">
                <p className="text-muted-foreground">Select a segment to view details and sample users</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

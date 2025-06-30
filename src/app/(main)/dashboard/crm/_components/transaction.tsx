import React from "react";

import { EllipsisVertical, LayoutList } from "lucide-react";

import SimpleIcon from "@/components/simple-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { cards, activities, ActivityContent } from "./types";

function LastTransaction() {
  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="p-4">
        <div className="flex w-full items-center justify-between">
          <div>
            <CardTitle>Last Transaction</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-muted rounded-full border-none p-1 outline-none focus:ring-0 focus:outline-none">
                <EllipsisVertical className="text-muted-foreground h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Show all entries</DropdownMenuItem>
              <DropdownMenuItem>Refresh</DropdownMenuItem>
              <DropdownMenuItem>Download</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        {/* <div className="min-w-[500px]"> */}
        <Table>
          <TableHeader>
            <TableRow className="w-full border-t border-b border-gray-200 font-semibold text-gray-700">
              <TableHead className="pl-6">Card</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map((card, index) => (
              <TableRow key={index} className="border-0">
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    {/* Fixed width container for card image */}
                    <div className="flex w-14 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 p-2">
                      <SimpleIcon icon={card.card} className="size-8" />
                    </div>

                    {/* Text content */}
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-muted-foreground text-sm">{card.number}</span>
                      <span className="text-muted-foreground text-sm">{card.through}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {" "}
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">{card.amount_status}</span>
                    <span className="text-muted-foreground text-sm">{card.date}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {" "}
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                      card.status.toLowerCase() === "rejected"
                        ? "bg-red-100 text-red-600"
                        : card.status.toLowerCase().includes("ver") // "Verified" or "Ver"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {card.status}
                  </span>
                </TableCell>
                <TableCell>{card.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* </div> */}
      </CardContent>
    </Card>
  );
}

function ActivityTimeline() {
  const colorOptions = [
    { dot: "bg-red-500", bg: "bg-red-100" },
    { dot: "bg-yellow-500", bg: "bg-yellow-100" },
    { dot: "bg-green-500", bg: "bg-green-100" },
    { dot: "bg-blue-500", bg: "bg-blue-100" },
    { dot: "bg-purple-500", bg: "bg-purple-100" },
    { dot: "bg-pink-500", bg: "bg-pink-100" },
    { dot: "bg-indigo-500", bg: "bg-indigo-100" },
    { dot: "bg-orange-500", bg: "bg-orange-100" },
  ];
  const getRandomColor = () => {
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
  };
  const coloredActivities = activities.map((activity) => ({
    ...activity,
    color: getRandomColor(),
  }));

  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center justify-center gap-1">
            <LayoutList /> <CardTitle>Activity Timeline</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-muted rounded-full border-none p-1 outline-none focus:ring-0 focus:outline-none">
                <EllipsisVertical className="text-muted-foreground h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Share timeline</DropdownMenuItem>
              <DropdownMenuItem>Suggest edits</DropdownMenuItem>
              <DropdownMenuItem>Report bug</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-2">
        <div className="relative pl-6">
          {coloredActivities.map((activity, index) => (
            <div key={index} className="relative flex min-h-[100px] gap-4">
              {/* Timeline column */}
              <div className="flex w-6 justify-center">
                <div className="relative flex h-full flex-col items-center">
                  {/* Dot */}
                  <div className={`rounded-full p-1 ${activity.color.bg}`}>
                    <div className={`h-3 w-3 rounded-full border-2 border-white shadow ${activity.color.dot}`} />
                  </div>

                  {/* Line below the dot */}
                  {index < activities.length - 1 && (
                    <div className="absolute top-5 h-[calc(100%-1.25rem)] w-[1px] bg-gray-300" />
                  )}
                </div>
              </div>

              {/* Main content block */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{activity.title}</h3>
                    <p className="mb-2 text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <p className="text-xs whitespace-nowrap text-gray-400">{activity.time}</p>
                </div>

                {/* Content items */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {/* <div className="flex flex-wrap gap-2 mt-2"> */}
                  {(() => {
                    const images = activity.content.filter((item) => item.type === "image");
                    const maxVisible = 3;

                    return (
                      <>
                        {images.slice(0, maxVisible).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.src}
                            alt={item.alt}
                            className="h-8 w-8 rounded-full border-2 border-white object-cover transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
                          />
                        ))}
                        {images.length > maxVisible && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium text-gray-600">
                            +{images.length - maxVisible}
                          </div>
                        )}
                      </>
                    );
                  })()}

                  {activity.content.map((item: ActivityContent, idx) => {
                    if (item.type === "text") {
                      return (
                        <div key={idx} className="text-muted-foreground flex flex-col text-sm">
                          <span className="font-medium text-gray-500">{item.value}</span>
                          {item.designation && <span className="ml-2 text-xs text-gray-500">({item.designation})</span>}
                        </div>
                      );
                    }
                    if (item.type === "file") {
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700"
                        >
                          <img src={item.icon} alt="file icon" className="h-4 w-4" />
                          {item.name}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Transaction() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <div className="col-span-1 flex flex-col sm:col-span-2 lg:col-span-3">
        <LastTransaction />
      </div>
      <div className="col-span-1 flex flex-col sm:col-span-2 lg:col-span-3">
        <ActivityTimeline />
      </div>
    </div>
  );
}

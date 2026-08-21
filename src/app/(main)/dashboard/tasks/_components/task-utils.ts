import type { Activity } from "@/app/(main)/dashboard/crm/_components/activities/activity-schema";
import {
  buildSearchHaystack,
  getScheduleState,
  getTaskDueAt,
  isCompletedThisMonth,
  isOpenTask,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-utils";
import { currentSalesOwnerId } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";

export const today = new Date(2026, 7, 16);
export const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
export const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

export function selectTasks(activities: Activity[]): Activity[] {
  return activities.filter((a) => a.type === "Task");
}

export interface TaskSummary {
  openCount: number;
  dueTodayCount: number;
  overdueCount: number;
  completedThisMonthCount: number;
  unassignedCount: number;
}

export function computeTaskSummary(tasks: Activity[]): TaskSummary {
  return {
    openCount: tasks.filter(isOpenTask).length,
    dueTodayCount: tasks.filter((t) => getScheduleState(t, today) === "Due Today").length,
    overdueCount: tasks.filter((t) => getScheduleState(t, today) === "Overdue").length,
    completedThisMonthCount: tasks.filter((t) => isCompletedThisMonth(t, today)).length,
    unassignedCount: tasks.filter((t) => t.ownerId === null && t.status !== "Canceled").length,
  };
}

export const taskSavedViews = [
  { id: "all", label: "All Tasks" },
  { id: "mine", label: "My Tasks" },
  { id: "due-today", label: "Due Today" },
  { id: "upcoming", label: "Upcoming" },
  { id: "overdue", label: "Overdue" },
  { id: "completed", label: "Completed" },
  { id: "canceled", label: "Canceled" },
  { id: "unassigned", label: "Unassigned" },
] as const;

export const taskDueDateOptions = ["All", "Overdue", "Today", "Tomorrow", "This Week", "This Month"] as const;

export interface TaskFilterParams {
  view: string;
  search: string;
  status: string;
  priority: string;
  owner: string;
  relatedType: string;
  dueDate: string;
  completionState: string;
}

export function applyTaskFilters(params: TaskFilterParams & { tasks: Activity[] }): Activity[] {
  let result = [...params.tasks];

  switch (params.view) {
    case "mine":
      result = result.filter((t) => t.ownerId === currentSalesOwnerId);
      break;
    case "due-today":
      result = result.filter((t) => getScheduleState(t, today) === "Due Today");
      break;
    case "upcoming":
      result = result.filter(
        (t) =>
          (t.status === "To Do" || t.status === "In Progress") &&
          new Date(getTaskDueAt(t)).getTime() > endOfToday.getTime(),
      );
      break;
    case "overdue":
      result = result.filter((t) => getScheduleState(t, today) === "Overdue");
      break;
    case "completed":
      result = result.filter((t) => t.status === "Completed");
      break;
    case "canceled":
      result = result.filter((t) => t.status === "Canceled");
      break;
    case "unassigned":
      result = result.filter((t) => t.ownerId === null && t.status !== "Canceled");
      break;
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter((t) => buildSearchHaystack(t).includes(q));
  }

  if (params.status !== "All") {
    result = result.filter((t) => t.status === params.status);
  }

  if (params.priority !== "All") {
    result = result.filter((t) => t.priority === params.priority);
  }

  if (params.owner !== "All") {
    if (params.owner === "me") {
      result = result.filter((t) => t.ownerId === currentSalesOwnerId);
    } else if (params.owner === "null") {
      result = result.filter((t) => t.ownerId === null);
    } else {
      result = result.filter((t) => t.ownerId === params.owner);
    }
  }

  if (params.relatedType !== "All") {
    result = result.filter((t) => {
      switch (params.relatedType) {
        case "Lead":
          return Boolean(t.leadId);
        case "Contact":
          return Boolean(t.contactId);
        case "Company":
          return Boolean(t.companyId);
        default:
          return Boolean(t.dealId);
      }
    });
  }

  if (params.dueDate !== "All") {
    result = result.filter((t) => {
      const due = new Date(getTaskDueAt(t));
      const time = due.getTime();
      switch (params.dueDate) {
        case "Overdue":
          return time < startOfToday.getTime() && (t.status === "To Do" || t.status === "In Progress");
        case "Today":
          return time >= startOfToday.getTime() && time <= endOfToday.getTime();
        case "Tomorrow": {
          const start = new Date(startOfToday);
          start.setDate(start.getDate() + 1);
          const end = new Date(endOfToday);
          end.setDate(end.getDate() + 1);
          return time >= start.getTime() && time <= end.getTime();
        }
        case "This Week": {
          const weekEnd = new Date(endOfToday);
          weekEnd.setDate(weekEnd.getDate() + 7);
          return time >= startOfToday.getTime() && time <= weekEnd.getTime();
        }
        case "This Month":
          return due.getMonth() === today.getMonth() && due.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });
  }

  if (params.completionState !== "All") {
    if (params.completionState === "Completed") {
      result = result.filter((t) => t.status === "Completed");
    } else if (params.completionState === "Open") {
      result = result.filter((t) => t.status === "To Do" || t.status === "In Progress");
    }
  }

  return result;
}

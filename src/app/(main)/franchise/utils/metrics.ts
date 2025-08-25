// Implementation of getMetrics function that matches FranchiseMetricsProps
export const getMetrics = (branches: any[], services: any[], washers: any[]) => {
  return {
    totalBranches: branches.length,
    totalServices: services.length,
    activeWashers: washers.filter((w: any) => w.status === "active").length,
    // totalBookings is optional and will default to 0
  };
};

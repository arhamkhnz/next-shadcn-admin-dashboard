import { usePathname } from "next/navigation";

const useVariantBasedOnRoute = (): ((route: string) => "default" | "ghost") => {
  const pathname = usePathname();

  return (route: string) => {
    // Get the last segment of the current pathname
    const pathSegments = pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Get the last segment of the route being passed
    const routeSegments = route.split("/").filter(Boolean);
    const lastRouteSegment = routeSegments[routeSegments.length - 1];

    // Compare the last segment of the pathname with the last segment of the route
    return lastSegment === lastRouteSegment ? "default" : "ghost";
  };
};

export default useVariantBasedOnRoute;

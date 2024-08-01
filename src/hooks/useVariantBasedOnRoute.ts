import { usePathname } from "next/navigation"

const useVariantBasedOnRoute = (): ((route: string) => "default" | "ghost") => {
  const pathname = usePathname()

  return (route: string) => (pathname.includes(route) ? "default" : "ghost")
}

export default useVariantBasedOnRoute

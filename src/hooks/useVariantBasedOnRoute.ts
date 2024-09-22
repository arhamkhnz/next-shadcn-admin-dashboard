import { usePathname } from "next/navigation"

const useVariantBasedOnRoute = (): ((route: string) => "default" | "ghost") => {
  const pathname = usePathname()
  return (route: string) => {
    return pathname === route ? "default" : "ghost"
  }
}

export default useVariantBasedOnRoute

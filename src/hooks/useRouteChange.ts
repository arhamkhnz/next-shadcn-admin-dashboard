import { useEffect } from "react"
import { usePathname } from "next/navigation"

const useRouteChange = (callback: () => void) => {
  const pathname = usePathname()

  useEffect(() => {
    callback()
  }, [pathname])
}

export default useRouteChange

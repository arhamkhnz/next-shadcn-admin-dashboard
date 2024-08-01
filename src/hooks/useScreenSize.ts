import { useState, useEffect } from "react"

const useScreenSize = () => {
  const [isMediumOrSmaller, setIsMediumOrSmaller] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMediumOrSmaller(window.innerWidth < 1024)
      }

      handleResize()

      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }
    return undefined
  }, [])

  return isMediumOrSmaller
}

export default useScreenSize

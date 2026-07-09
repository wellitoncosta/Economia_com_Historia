import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    mql.addEventListener("change", onChange)
    
    // Set initial value inside setTimeout to avoid synchronous state update in effect
    setTimeout(() => setIsMobile(mql.matches), 0)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

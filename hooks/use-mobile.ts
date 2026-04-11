import * as React from "react"

// const MOBILE_BREAKPOINT = 768

const screenBreakPoints = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }
export function useIsMobile(breakPoint: keyof typeof screenBreakPoints = 'sm') {

  const value = screenBreakPoints[breakPoint]

  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${value - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < value)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < value)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

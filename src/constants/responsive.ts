export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
} as const;

export const isMobile = (width: number): boolean => width < BREAKPOINTS.mobile;
export const isTablet = (width: number): boolean => 
  width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
export const isDesktop = (width: number): boolean => width >= BREAKPOINTS.tablet;

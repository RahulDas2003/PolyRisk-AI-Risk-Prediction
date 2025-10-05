import * as React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = {
  default: "border-transparent bg-teal-600 text-white hover:bg-teal-700",
  secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
  destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
  outline: "text-gray-700 border-gray-300",
  risk: "border-transparent text-white",
  "risk-low": "bg-green-500 hover:bg-green-600",
  "risk-moderate": "bg-yellow-500 hover:bg-yellow-600",
  "risk-high": "bg-orange-500 hover:bg-orange-600",
  "risk-severe": "bg-red-500 hover:bg-red-600",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        badgeVariants[variant],
        className
      )} 
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
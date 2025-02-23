import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// PENDING
// OPENED
// CLICKED
// SENT
// DELIVERED
// DELIVERED_DELAYED
// COMPLAINED
// BOUNCED
// CANCELLED

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        open: "bg-green-500 text-white rounded-2xl border-green-800",
        close: "bg-red-500 text-white rounded-2xl border-red-800",
        connecting: "bg-yellow-500 text-white rounded-2xl border-yellow-800",
        ended: "bg-orange-500 text-white rounded-2xl border-orange-800",
        archived: "bg-gray-500 text-white rounded-2xl border-gray-800",
        active: "bg-green-500 text-white rounded-2xl border-green-800",

        draft: "bg-gray-100 text-gray-600 rounded-md border-gray-600",

        pending: "bg-yellow-100 text-yellow-600 rounded-md border-yellow-600",        
        opened: "bg-green-100 text-green-600 rounded-md border-green-600",
        clicked: "bg-purple-100 text-purple-600 rounded-md border-purple-600",
        sent: "bg-gray-100 text-gray-600 rounded-md border-gray-600",
        delivered: "bg-green-100 text-green-600 rounded-md border-green-600",
        delivered_delayed: "bg-yellow-100 text-yellow-600 rounded-md border-yellow-600",
        complained: "bg-red-100 text-red-600 rounded-md border-red-600",
        bounced: "bg-red-100 text-red-600 rounded-md border-red-600",
        cancelled: "bg-gray-100 text-gray-600 rounded-md border-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

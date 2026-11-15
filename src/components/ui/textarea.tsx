import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full resize-none rounded-lg border border-border/60 dark:border-0 bg-background dark:bg-card px-3 py-2.5 text-sm text-foreground transition-colors outline-none",
        "placeholder:text-muted-foreground placeholder:font-normal leading-relaxed",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:text-foreground/80 disabled:opacity-80",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

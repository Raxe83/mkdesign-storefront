import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/utils/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-1.5 py-0.5 uppercase tracking-wide text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
        new: "bg-accent text-white",
        sale: "bg-red-500 text-white",
        handmade:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        soldout:
          "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, children, ...props }: BadgeProps) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
};

export default Badge;
export { badgeVariants };

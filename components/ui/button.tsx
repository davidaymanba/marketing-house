import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "gradient-border relative inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full font-semibold",
    "transition-[box-shadow,background-color,color] duration-500 ease-expo",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: "bg-signature text-white shadow-[0_10px_40px_-12px_rgba(124,58,237,0.7)] hover:shadow-glow",
        ghost: "border border-line bg-white/[0.02] text-fg backdrop-blur-md hover:bg-surface/70",
        subtle: "bg-surface text-fg hover:bg-surface/70",
      },
      size: {
        sm: "h-10 px-5 text-sm",
        md: "h-12 px-7 text-[0.95rem]",
        lg: "h-14 px-9 text-base md:h-16 md:px-10 md:text-lg",
        icon: "size-12",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantProps
>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = "Button";

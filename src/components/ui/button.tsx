import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[20px] text-xl font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[#006EFF] text-white shadow-md hover:bg-[#0056CC]",
        destructive:
          "bg-red-500 text-white shadow-md hover:bg-red-600 focus-visible:ring-red-300 dark:focus-visible:ring-red-500 dark:bg-red-400",
        outline:
          "border border-gray-300 bg-white text-gray-700 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700",
        secondary:
          "bg-green-500 text-white shadow-md hover:bg-green-600",
        ghost:
          "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
        link: "text-[#006EFF] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-22 py-6 has-[>svg]:px-4",
        sm: "h-9 rounded-full gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-full px-8 has-[>svg]:px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

interface LinkButtonProps {
  label: string;
  link: string;
  disabled?: boolean;
  prefetch?: boolean;
  className?: string;
}

const LinkButton = ({ label, link, disabled, prefetch = false, className = "" }: LinkButtonProps) => {
  return (
    <Link
      prefetch={prefetch}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
        }
      }}
      className={`block w-full text-center py-2.5 rounded-[20px]  ${
        disabled
          ? "bg-white text-[#A7A7A7] border border-black/30 cursor-auto"
          : "bg-[#006EFF] text-white"
      } hover:opacity-70 text-xl font-semibold ${className}`}
      href={link}
    >
      {label}
    </Link>
  );
};

interface UnderlineButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const UnderlineButton = ({ label, onClick, className = "" }: UnderlineButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`text-sm text-gray-600 hover:text-gray-800 underline ${className}`}
    >
      {label}
    </button>
  );
};

export { Button, buttonVariants, LinkButton, UnderlineButton }

import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

export const useToast = () => {
  const toast = ({ title, description, variant = "default", duration }: ToastProps) => {
    const message = description ? `${title}: ${description}` : title
    
    if (variant === "destructive") {
      sonnerToast.error(message, { duration })
    } else {
      sonnerToast.success(message, { duration })
    }
  }

  return { toast }
}

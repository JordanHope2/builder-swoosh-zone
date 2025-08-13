<<<<<<< HEAD
import React from "react"
=======
import { useToast } from "../../hooks/use-toast";
>>>>>>> 33153d85e12907d914e88dfe4a57cab614d8392b
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
<<<<<<< HEAD
  getToastIcon,
} from "./toast"
import { useToast } from "../../hooks/use-toast"
=======
} from "./toast";
>>>>>>> 33153d85e12907d914e88dfe4a57cab614d8392b

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props} aria-live="polite">
            <div className="flex items-start space-x-3">
              {getToastIcon(variant)}
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action && React.isValidElement(action) ? action : null}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

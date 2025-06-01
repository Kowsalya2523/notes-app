export interface NotificationPopupProps {
  message: string
  type?: "success" | "error" | "warning" | "info"
  show: boolean
  onClose: () => void
  autoDismiss?: boolean
  duration?: number
}

export interface AddNoteProps {
  onCancel: () => void;
}

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
  noteToEdit?: {
    id: string;
    title: string;
    description: string;
  } | null;
}


export interface CommonPopupProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}
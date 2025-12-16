import { useEffect, useState } from "react";

interface NotificationSnackbarProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

export default function NotificationSnackbar({
  message,
  open,
  onClose,
}: NotificationSnackbarProps) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const snackbarClass = visible
    ? "translate-y-0 opacity-100"
    : "translate-y-full opacity-0";

  return (
    <div
      className={`
        fixed bottom-4 left-1/2 transform -translate-x-1/2 
        w-[90%] max-w-md px-5 py-3 rounded-xl
        bg-white/20 backdrop-blur-xl text-white shadow-xl
        transition-all duration-300 z-50
        ${snackbarClass}
      `}
    >
      <p className="text-center font-medium">{message}</p>
    </div>
  );
}

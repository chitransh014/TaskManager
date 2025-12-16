interface SnackbarProps {
  message: string;
  visible: boolean;
}

export default function Snackbar({ message, visible }: SnackbarProps) {
  return (
    <div
      className={`
        fixed bottom-6 left-1/2 transform -translate-x-1/2 
        px-6 py-3 rounded-xl 
        bg-white/20 backdrop-blur-xl text-white 
        shadow-lg transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      {message}
    </div>
  );
}

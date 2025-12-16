import { createContext, useContext, useState } from "react";

interface NotificationContextType {
  show: (msg: string) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  show: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const show = (msg: string) => {
    setMessage(msg);
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ show }}>
      {children}
      <Snackbar message={message} visible={visible} />
    </NotificationContext.Provider>
  );
};

// Import Snackbar at bottom to avoid circular import issues
import Snackbar from "../components/Snackbar";

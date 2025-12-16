import AppRouter from "./router/AppRouter";
import { useEffect, useState } from "react";
import { socket } from "./sockets/socket";
import NotificationSnackbar from "./components/NotificationSnackbar";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  return <AppRouter />;
}

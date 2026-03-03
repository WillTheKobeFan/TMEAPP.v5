import React, { createContext, useContext, useState } from "react";

// Define the types for our notification context
type NotificationContextType = {
  unreadCount: number;
  markAllRead: () => void;
};

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Provider component
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);

  // Function to mark all notifications as read
  const markAllRead = () => setUnreadCount(0);

  return (
    <NotificationContext.Provider value={{ unreadCount, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use notifications
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

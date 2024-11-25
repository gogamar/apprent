"use client";

import { createContext, useContext, useState } from "react";

// Create the context
const SidebarContext = createContext();

// Custom hook to use the context
export const useSidebar = () => {
  return useContext(SidebarContext);
};

// Provider component
export const SidebarProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

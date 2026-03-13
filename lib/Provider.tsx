"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useMemo } from "react";

const Provider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const queryClient = useMemo(() => new QueryClient(), []);
  
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Provider;

"use client";

import { ChakraProvider, Container } from "@chakra-ui/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Provider } from "jotai";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
    <ChakraProvider>
      <UserProvider>{children}</UserProvider>
    </ChakraProvider>
    </Provider>
  );
}

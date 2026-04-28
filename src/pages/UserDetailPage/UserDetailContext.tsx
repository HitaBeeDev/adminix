import { createContext, useContext } from "react";
import type { User } from "@/types/user";

interface UserDetailContextValue {
  user: User;
  refreshUser: () => void;
}

export const UserDetailContext = createContext<UserDetailContextValue | null>(null);

export function useUserDetailContext() {
  const value = useContext(UserDetailContext);

  if (!value) {
    throw new Error("useUserDetailContext must be used within UserDetailContext.Provider");
  }

  return value;
}

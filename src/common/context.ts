"use client";
import { createContext } from "react";

type ClientSessionContextType = {
  token: string;
  clientId: string;
  companyId: string;
};

export const ClientSessionContext = createContext<ClientSessionContextType>({
  token: "",
  clientId: "",
  companyId: "",
});

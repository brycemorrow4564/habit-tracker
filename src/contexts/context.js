import * as React from "react"; 

export const RootContext = React.createContext();
export const RootProvider = RootContext.Provider;

export function useRootContext() {
    return React.useContext(RootContext); 
}
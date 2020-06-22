import * as React from "react"; 

// https://hswolff.com/blog/how-to-usecontext-with-usereducer/

// export const RootContext = React.createContext();
// export const RootProvider = RootContext.Provider;

export const StateContext = React.createContext();
export const DispatchContext = React.createContext();
export const StateProvider = StateContext.Provider; 
export const DispatchProvider = DispatchContext.Provider;

export function useRootContext() {
    const dispatch = React.useContext(DispatchContext);
    const state = React.useContext(StateContext);
    return { state, dispatch }; 
}
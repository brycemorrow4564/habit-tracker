import * as React from "react"; 

export const AnimationContext = React.createContext();
export const AnimationProvider = AnimationContext.Provider;

export function useAnimationContext() {
    return React.useContext(AnimationContext); 
}
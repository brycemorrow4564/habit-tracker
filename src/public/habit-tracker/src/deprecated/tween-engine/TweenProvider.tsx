import * as React from "react";
import _ from "lodash"; 
import { reducer, reducerInitialState } from "./reducerAnimation"; 
import { AnimationProvider } from "./animationContext"; 
import TweeningTimer from "./TweeningTimer"; 

export interface TweenProviderProps {

};

const TweenProvider: React.FC<TweenProviderProps> = (props) => {

    const [ state, dispatch ] = React.useReducer(reducer, reducerInitialState);
    
    return (
        <AnimationProvider value={{ state, dispatch }}>
            <TweeningTimer/>
            {props.children}
        </AnimationProvider>    
    );

};

export default TweenProvider; 
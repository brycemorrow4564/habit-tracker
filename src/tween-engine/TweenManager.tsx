import * as React from "react";
import _ from "lodash"; 
import { reducer, reducerInitialState } from "./reducerAnimation"; 
import { AnimationProvider } from "./animationContext"; 

export interface TweenManagerProps {

};

const TweenManager: React.FC<TweenManagerProps> = (props) => {

    const [ state, dispatch ] = React.useReducer(reducer, reducerInitialState);
    
    return (
        <AnimationProvider value={{ state, dispatch }}>
            {props.children}
        </AnimationProvider>    
    );

};

export default TweenManager; 
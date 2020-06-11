import * as React from "react";
import _ from "lodash"; 
import { useAnimationContext } from "./animationContext"; 

export interface AnimationInterpolatorProps {

};

const AnimationInterpolator: React.FC<AnimationInterpolatorProps> = (props) => {

    const { state, dispatch } = useAnimationContext();
    const { queueCount, running } = state; 
    
    const localQueueCountRef = React.useRef<number>(0); 
    const localFrameRef = React.useRef<number>(0); 
    const localRunningRef = React.useRef<boolean>(running); 
   
    localRunningRef.current = running; 

    React.useEffect(() => {

        let ticked = (timestamp: number) => {
            if (localRunningRef.current) {
                dispatch(['STEP TIME', timestamp]); 
                localFrameRef.current = requestAnimationFrame(ticked);
            } else {
                cancelAnimationFrame(localFrameRef.current); 
            }
        };

        if (queueCount && queueCount !== localQueueCountRef.current) {
            localQueueCountRef.current = queueCount; 
            localRunningRef.current = true; 
            localFrameRef.current = requestAnimationFrame(ticked);
        }

        return () => cancelAnimationFrame(localFrameRef.current);

    }, [queueCount, localQueueCountRef, localRunningRef]); 
    
    return null;

};

export default AnimationInterpolator; 
import * as React from "react";
import _ from "lodash"; 
import { useAnimationContext } from "./animationContext"; 

export interface TweeningTimerProps {

};

const TweeningTimer: React.FC<TweeningTimerProps> = (props) => {

    const { state, dispatch } = useAnimationContext();
    const { queueCount, running } = state; 
    
    const localQueueCountRef = React.useRef<number>(0); 
    const localFrameRef = React.useRef<number>(0); 
    const localRunningRef = React.useRef<boolean>(running); 
   
    localRunningRef.current = running; 

    let ticked = (timestampIndex: number, timestamp: number) => {
        if (localRunningRef.current) {
            console.log('STEPPING', timestamp, timestampIndex);
            dispatch(['STEP TIME', [timestamp, timestampIndex]]); 
            localFrameRef.current = requestAnimationFrame(_.partial(ticked, timestampIndex+1));
        } else {
            cancelAnimationFrame(localFrameRef.current); 
        }
    };

    React.useEffect(() => {

        if (queueCount && queueCount !== localQueueCountRef.current) {
            localQueueCountRef.current = queueCount; 
            localRunningRef.current = true; 
            localFrameRef.current = requestAnimationFrame(_.partial(ticked, 0));
        }

        return () => cancelAnimationFrame(localFrameRef.current);

    }, [queueCount]); 
    
    return null;

};

export default TweeningTimer; 
import * as React from "react";
import _ from "lodash"; 
import { interpolateRgb } from "d3-interpolate"; 
import { easeCubic, easeSinIn } from 'd3-ease'; 
import { reducer, reducerInitialState } from "./reducerAnimation";
import { Animation } from "./animationManagerHooks";  
import { useAnimationContext } from "./animationContext"; 
import { useRootContext } from "../contexts/context"; 

export interface AnimationInterpolatorProps {

};



let last = (arr: any[]) => (arr.length ? arr[arr.length-1] : null); 

const AnimationInterpolator: React.FC<AnimationInterpolatorProps> = (props) => {

    /* 
    Enables multiple asynchronous read / write ports for animation property data 

        *   listens for changes in activeGroupId and triggerCount. These two keys can 
            be used as a key that uniquely identify that an action has been triggered 
        *   when an animation has been triggered, we start interpolating all values

    */ 

   const { state, dispatch } = useAnimationContext();
   const { activeGroupId, triggerCount, data, running } = state; 

    const [runningList, setRunningList] = React.useState<{ startTime: number, groupId: string }[]>([]); 
    const [frame, setFrame] = React.useState<number>(0); 
    const [animationLoopRunning, setAnimationLoopRunning] = React.useState<Boolean>(false); 
    const [lastKey, setLastKey] = React.useState<string | null>(null); 
    const key = `${triggerCount} ${activeGroupId}`; // uniquely identifies animation, user-defined  
    const groupData = activeGroupId ? _.cloneDeep(data[activeGroupId]) : {}; // the animation group to trigger
    const groupKeys = Object.keys(groupData); // all group ids within the animation group 

    // list of animations in progress 
    const [q, setQ] = React.useState<Animation[]>([]); 
    // list of animations that have not yet been started 
    const [unq, setUnq] = React.useState<Animation[]>(groupKeys.map(key => groupData[key])); 

    // for each queued animation group we store 
    // groupId, startTime. we use a compound key "groupId-startTime" to index into dynamic data store 
    // which holds the interpolated values 

    React.useEffect(() => {

        function ticked(startNewGroup: Boolean, timestamp: number) {

            if (startNewGroup) {

                if (runningList.map(({ groupId }) => groupId).includes(activeGroupId)) {
                    // only one animation of a specified type can be active at a given time
                    return; 
                }
                // Initialize a running animation group instance 
                let newRunningList = _.clone(runningList); 
                newRunningList.push({ startTime: timestamp, groupId: activeGroupId }); 
                if (!animationLoopRunning) {
                    setAnimationLoopRunning(true);
                }
                setRunningList(newRunningList);

                // add all animations from current active group to the unqueued set of animations
                let toUnq: Animation[] = []; 
                for (let key of groupKeys) {
                    let animations: Animation[] = groupData[key]; 
                    for (let animation of animations) {
                        // add to the unqueued set 
                        animation.setStartTime(timestamp); 
                        toUnq.push(animation); 
                    }
                }
                setUnq(_.concat(_.clone(unq), toUnq));
                setFrame(requestAnimationFrame(_.partial(ticked, false)));
            } else {
                // information on all running animation groups
                // let animationGroupList = _.cloneDeep(runningList); 
                console.log("we in deep homie"); 
                let newUnq = _.cloneDeep(unq); 
                let newQ = _.cloneDeep(q); 

                // move elements from newUnq to newQ 
                let keepInds: number[] = []; 
                for (let i = 0; i < newUnq.length; i++) {
                    let unqAni = newUnq[i]; 
                    // @ts-ignore
                    let elapsed = timestamp - unqAni.startTime;
                    if (elapsed >= unqAni.delay) {
                        newQ.push(unqAni);
                    } else {
                        keepInds.push(i);
                    }
                }
                newUnq = newUnq.filter((d,i) => keepInds.includes(i)); 

                // process all elements in newQ. remove elements when done
                let animationData: { [key: string]: any }= {}; 
                keepInds = []
                for (let i = 0; i < newQ.length; i++) {
                    let ani = newQ[i]; 
                    // @ts-ignore
                    let elapsed = timestamp - (ani.startTime + ani.delay);
                    let t = elapsed / ani.duration; 
                    let value = ani.step(Math.min(1, t)); 
                    animationData[ani.generateInterpolationKey()] = value; 
                    if (elapsed < ani.duration) {
                        // this animation is still running
                        keepInds.push(i);
                    }
                }
                newQ = newQ.filter((d,i) => keepInds.includes(i)); 

                console.log(animationData); 

                // update local state and context variables 
                setQ(newQ); 
                setUnq(newUnq);
                if (newQ.length) {
                    setFrame(requestAnimationFrame(_.partial(ticked, false)));
                }

            }

        };

        if (triggerCount > 0 && key !== lastKey) {
            // start the animation loop 
            console.log('triggering'); 
            setLastKey(key); 
            setFrame(requestAnimationFrame(_.partial(ticked, true)));
        }

        return cancelAnimationFrame(frame);

    }, [
        triggerCount, 
        frame, 
        runningList, 
        activeGroupId, 
        key, 
        lastKey, 
        animationLoopRunning, 
        groupData, 
        groupKeys, 
        unq, 
        q
    ]); 
    
    return null;

        // const { singleWeekXAnchors } = state; 

    // return

    // const nRows = 10; 
    // const nCols = 7;

    // React.useEffect(() => {

    //     // the first timestamp 
    //     let startTime: number = 0;
        
    //     // the animation frame id 
    //     let frame: number = 0;      

    //     // const interpolators: { [key: string]: Function }= {}; 


    //     function ticked(keys: string[], 
    //                     durations: number[], 
    //                     timestamp: number) {

    //         if (!startTime) startTime = timestamp;
    //         const elapsed = timestamp - startTime;

    //         let running = false; 
    //         for (let i = 0; i < durations.length; i++) {
    //             let key = keys[i]; 
    //             let duration = durations[i]; 
    //             let t = elapsed / duration; 
    //             let interpolator = interpolators[key]; 
    //             if (elapsed < duration) {
    //                 running = true; 
    //                 // interpolate all properties over all circles 
    //                 let animationsData = _.cloneDeep(animations)[key]; 


    //                 // opacity
    //                 for (let r = 0; r < animationsData.length; r++) {
    //                     let row = animationsData[r]; 
    //                     for (let c = 0; c < row.length; c++) {

    //                     }
    //                 }


    //                 let value = interpolator(t); 
    //             }
    //         }

    //         if (running) {
    //             frame = requestAnimationFrame(_.partial(ticked, keys, durations));
    //         }

    //     };

    //     if (queuedAnimations.length) {

    //         let keys: string[] = []; 
    //         let durations: number[] = []; 
    //         let startValues: { [keys: string] : any }= {}; 
    //         let endValues: { [keys: string] : any }= {}; 

    //         for (let { key, duration, type, values } of queuedAnimations) { 

    //             let interpolator; 
    //             switch (type) {
    //                 case 'singleWeekView-circles-opacity':
    //                     startValues[key] = _.range(0, nRows).map(i => _.range(0, nCols)).map(v => values[0]);
    //                     endValues[key] = _.range(0, nRows).map(i => _.range(0, nCols)).map(v => values[1]);
    //                     interpolator = (t: number) => {
    //                         values[0] + t * (values[1] - values[0]); 
    //                     }; 
    //                     break; 
    //                 case 'singleWeekView-circles-fill':
    //                     startValues[key] = _.range(0, nRows).map(i => _.range(0, nCols)).map(v => values[0]);
    //                     endValues[key] = _.range(0, nRows).map(i => _.range(0, nCols)).map(v => values[1]);
    //                     interpolator = interpolateRgb(values[0], values[1]);
    //                     break; 
    //                 case 'singleWeekView-circles-transform':
    //                     let [[xMax, y],[scaleMin, scaleMax]] = values
    //                     interpolator = (data: any, t: number): string => {
    //                         let tNorm = easeSinIn(t); 
    //                         let scaleRange = scaleMax - scaleMin;
    //                         return `translate(${xMax * tNorm}, ${y}) 
    //                                 scale(${scaleRange * tNorm + scaleMin})`;
    //                     }
    //                     break; 
    //                 default:
    //                     throw Error("Unknown animation type"); 
    //             }
    //             interpolators[key] = interpolator;

    //         }

    //         setTimeout(() => {
    //             requestAnimationFrame(_.partial(ticked, keys, durations));
    //         }, 0);

    //     }

    //     return () => cancelAnimationFrame(frame); 

    // }, [queuedAnimations]); 

    return null; 
};

export default AnimationInterpolator; 
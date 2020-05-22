import * as React from "react";
import _ from "lodash"; 
import { interpolateRgb } from "d3-interpolate"; 
import { easeCubic, easeSinIn } from 'd3-ease'; 
import { useRootContext } from "../context"; 

export interface AnimationMonitorProps {

};

const activeColor = "#6ded81" ; 
const inactiveColor = "#eeeae8";

const minOpacity = .1; 
const maxOpacity = 1; 

const colorTransitionDuration = 250; 
const scaleDuration = 1250; 
const opacityDuration = 1250;
const translateDuration = 1500;

class GridMatrix {

    private data: any[]; 

    constructor(public nRows: number, public nCols: number) {
        this.data = new Array(nRows * nCols); 
        this.zero(); 
    }

    getElement(i: number, j: number) {
        return this.data[i*this.nCols + j];
    }

    setElement(i: number, j: number, value: any) {
        this.data[i*this.nCols + j] = value;
    }

    zero() {
        this.data.fill(0); 
    }

}

const AnimationMonitor: React.FC<AnimationMonitorProps> = (props) => {

    /*
    Each element that desires to be animated (ScalableCircle in this app), 
    must dispatch an action specifying an animation key which the object 
    desires to be associated with, 
        duration
        delay before starting


    */ 

    const { state, dispatch } = useRootContext(); 
    const { queuedAnimations, animations, singleWeekXAnchors } = state; 

    const nRows = 10; 
    const nCols = 7;

    let getGridMatrix = () => {
        
    }

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

export default AnimationMonitor; 
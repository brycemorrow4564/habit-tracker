import * as React from "react";
import _ from "lodash"; 
import { interpolateRgb } from "d3-interpolate"; 
import { scaleLinear } from "d3-scale"; 
import { easeCubic, easeSinIn, easePolyOut } from 'd3-ease'; 
import { useRootContext } from "../contexts/context"; 
import { Animation, AnimationType, useAnimationRegistrar } from "../deprecated/animationManagerHooks"; 

const minOpacity = 1; 

export interface CircleScalableProps {
    cx: number,         // x coord of origin 
    cy: number,         // y coord of origin
    r: number,          // radius of circle
    value: number,      // value which determines fill
    delay: number,      // amount of time to delay scaling animation 
    rowIndex: number    // row index of this circle in single week view grid 
    colIndex: number    // col index of this circle in single week view grid 
};

const activeColor = "#6ded81" ; 
const inactiveColor = "rgba(232, 229, 227, .75)";

const scaleDuration = 500; 
const opacityDuration = 250;
const translateDuration = 250;
const innerGrowDuration = 325;

const minScale = 1; 
const maxScale = 1; 

// @ts-ignore
let getTransform = ({ cx, cy, minScale }) => (`translate(${cx},${cy}) scale(${minScale})`); 
// @ts-ignore
let getActiveTransform = ({ transformStr, value }) => `${transformStr} scale(${value === 0 ? 0 : 1})` 

const CircleScalable: React.FC<CircleScalableProps> = (props) => {

    const { dispatch } = useRootContext(); 
    const { cx, cy, r, value, delay, rowIndex, colIndex } = props; 

    const [localValue, setLocalValue]                       = React.useState<number>(value); 
    const [opacityBackground, setOpacityBackground]         = React.useState<number>(minOpacity); 
    const [transformStr, setTransformStr]                   = React.useState<string>(getTransform({ cx, cy, minScale })); 
    const [transformStrActive, setTransformStrActive]       = React.useState<string>(getActiveTransform({ transformStr, value })); 

    // React.useEffect(() => {

    //     let transformStr = getTransform({ cx, cy, minScale })
    //     setTransformStr(transformStr); 
    //     setTransformStrActive(getActiveTransform({ transformStr, value })); 

    // }, [cx, cy, minScale]);                                                                                      

    // React.useEffect(() => {

    //     let startTime: number = 0;
    //     let frame: number = 0;

    //     function ticked(timestamp: number) {
    //         if (!startTime) startTime = timestamp;

    //         const elapsed = timestamp - startTime;
    //         const scaleT = Math.min(1, elapsed / scaleDuration);
    //         const translateT = Math.min(1, elapsed / translateDuration); 
    //         const opacityT = Math.min(1, elapsed / opacityDuration);

    //         if (elapsed < Math.max(...[scaleDuration, translateDuration, opacityDuration])) {
    //             // if the elapsed time is less than the duration, continue the animation
    //             const transformStr = getTransformString(scaleT, translateT);
    //             setTransformStr(transformStr); 
    //             setTransformStrActive(`${transformStr} scale(${value === 0 ? 0 : 1})`);
    //             setOpacityBackground(easeSinIn(opacityT) * (1-minOpacity) + minOpacity); 
    //             frame = requestAnimationFrame(ticked);
    //         }
    //     };

    //     function getTransformString(scaleT: number, translateT: number): string {
    //         let tScaleNorm = easeSinIn(scaleT); 
    //         let tTranslateNorm = easeCubic(translateT); 
    //         let scaleRange: number =  maxScale - minScale;
    //         return `translate(${cx},${cy}) 
    //                 scale(${scaleRange * tScaleNorm + minScale})`;
    //     }

    //     setTimeout(() => {
    //         requestAnimationFrame(ticked);
    //     }, delay);

    //     return () => cancelAnimationFrame(frame); 
        

    // }, [minScale, maxScale, delay]); 

    // Whenever the corresponding value for a circle was updated in the store 
    // we initiate a transition to an active / inactive color state. 
    React.useEffect(() => {

        let startTime: number = 0;
        let frame: number = 0;

        let startScale = value === 1 ? 0 : 1; 
        let endScale = value === 0 ? 0 : 1; 
        let scale = scaleLinear()
                        .domain([0, 1])
                        .range([startScale, endScale]); 

        function getTransformStringActive(t: number) {
            let tNorm = easePolyOut(t, .5); 
            return `${transformStr} scale(${scale(tNorm)})`; 
        }

        function ticked(timestamp: number) {
            if (!startTime) startTime = timestamp;

            const elapsed = timestamp - startTime;
            const t = Math.min(1, elapsed / innerGrowDuration);

            if (elapsed < innerGrowDuration) {
                // if the elapsed time is less than the duration, continue the animation
                const newTransformStrActive = getTransformStringActive(t); 
                setTransformStrActive(newTransformStrActive); 
                frame = requestAnimationFrame(ticked);
            }
        };
        
        if (localValue !== value) {
            // a click event created a request to change the underlying data 
            // the data has been changed and now we should transition the color 
            // fill of the circle to represent this. 
            setLocalValue(value);
            requestAnimationFrame(ticked);
        }

        return () => cancelAnimationFrame(frame); 

    }, [localValue, value]); 

    return (
        <React.Fragment>
            {/* grey background */}
            <circle
            cx={0}
            cy={0}
            r={r}
            fill={inactiveColor}
            transform={transformStr}
            fillOpacity={opacityBackground}
            // onClick={() =>  dispatch(['set dataRowCol', [rowIndex, colIndex, 1]])}
            />
            {/* green foreground */}
            <circle
            cx={0}
            cy={0}
            r={r}
            fill={activeColor}
            transform={transformStrActive}
            fillOpacity={opacityBackground}
            pointerEvents={value === 1 ? 'visiblePoint' : 'none'}
            // onClick={() =>  dispatch(['set dataRowCol', [rowIndex, colIndex, 0]])}
            /> 
        </React.Fragment>
        
    ); 
};

export default CircleScalable; 
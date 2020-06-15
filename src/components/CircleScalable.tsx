import * as React from "react";
import _ from "lodash"; 
import { interpolateRgb } from "d3-interpolate"; 
import { scaleLinear } from "d3-scale"; 
import { easeCubic, easeSinIn, easePolyOut } from 'd3-ease'; 
import { useRootContext } from "../contexts/context"; 
import { Tweenable, TweenableType, TweenableConnector } from "../tween-engine/tween"; 
import { useTweenValue } from "../tween-engine/hooks"; 

export interface CircleScalableProps {
    cx: number,         // x coord of origin 
    cy: number,         // y coord of origin
    r: number,          // radius of circle
    value: number,      // value which determines fill
    delay: number,      // amount of time to delay scaling animation 
    rowIndex: number,   // row index of this circle in single week view grid 
    colIndex: number,   // col index of this circle in single week view grid 
    fillColor: string   // the fill color of the foreground 
};

const activeColor = "rgb(111, 255, 176)" ; 
const inactiveColor = "#f8f8f8";
const duration = 250; 

// @ts-ignore
let getBackgroundTransform = ({ cx, cy }) => (`translate(${cx},${cy})`); 
// @ts-ignore
let getForegroundTransform = ({ cx, cy, value }) => `translate(${cx},${cy}) scale(${value === 0 ? 0 : 1})`;

const CircleScalable: React.FC<CircleScalableProps> = (props) => {

    const { dispatch } = useRootContext(); 
    const { cx, cy, r, value, rowIndex, colIndex, fillColor } = props; 
    const [transformStr, setTransformStr] = React.useState<string>(getBackgroundTransform({ cx, cy })); 
    const [tReady, config, tValue] = useTweenValue(TweenableType.svgTransformString, getForegroundTransform({ cx, cy, value })); 
    
    return (
        <React.Fragment>
            {/* grey background */}
            <circle
            cx={0}
            cy={0}
            r={r}
            fill={inactiveColor}
            transform={transformStr}
            fillOpacity={1}
            onClick={() =>  {
                // begins animation 
                config.toValue(getForegroundTransform({ cx, cy, value: 1 })).duration(duration).start(); 
                // updates corresponding data value 
                dispatch(['set value habit table', [rowIndex, colIndex, 1]])
            }}/>
            {/* green foreground */}
            <circle
            cx={0}
            cy={0}
            r={r}
            fill={fillColor}
            transform={tReady ? tValue : 'scale(1)'}
            fillOpacity={1}
            pointerEvents={value === 1 ? 'visiblePoint' : 'none'}
            onClick={() =>  {
                // begins animation 
                config.toValue(getForegroundTransform({ cx, cy, value: 0 })).duration(duration).start(); 
                // updates corresponding data value 
                dispatch(['set value habit table', [rowIndex, colIndex, 0]])
            }}/> 
        </React.Fragment>
        
    ); 
};

export default CircleScalable; 
import * as React from "react";
import _ from "lodash"; 
import { motion, useMotionValue, useTransform } from "framer-motion"
import { useRootContext } from "../contexts/context"; 

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

const CircleScalable: React.FC<CircleScalableProps> = (props) => {

    const { dispatch } = useRootContext(); 
    const { cx, cy, r, value, rowIndex, colIndex, fillColor } = props; 

    return (
        <React.Fragment>
            {/* grey background */}
            <circle
            cx={cx}
            cy={cy}
            r={r}
            fill={inactiveColor}
            onClick={() =>  {
                dispatch(['set value habit table', [rowIndex, colIndex, 1]])
            }}/>
            {/* green foreground */}
            <motion.circle
            initial={{ scale: value ? 1 : 0 }}
            animate={{ scale: value ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            transformTemplate={(transform: any, generatedTransform: any) => `translate(${cx}px,${cy}px) ${generatedTransform}`}
            cx={0}
            cy={0}
            r={r}
            fill={fillColor}
            onClick={() =>  {
                dispatch(['set value habit table', [rowIndex, colIndex, 0]])
            }}/> 
        </React.Fragment>
        
    ); 
};

export default CircleScalable; 
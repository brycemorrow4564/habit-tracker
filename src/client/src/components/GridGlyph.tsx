import * as React from "react";
import _ from "lodash"; 
import { motion } from "framer-motion"
import { useRootContext } from "../contexts/context"; 
import { colors } from "../utils/color"; 
import { withoutKeys } from "../utils/util"; 
import { ReducerState } from "../reducers/reducer";

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

interface RectGlyphProps {
    [key: string]: any      // can include other property values to pass through to 
                            // the underlying svg.rect DOM node 
    cx: number,             // the center x coordinate of the rectangle 
    cy: number,             // the center y coordinate of the rectangle 
    width: number,          // the width of the rectangle 
    height: number,         // the height of the rectangle 
    useMotion?: boolean,    // whether or not the DOM node uses framer-motion implementation 
};

interface CircleGlyphProps {
    [key: string]: any      // can include other property values to pass through to 
                            // the underlying svg.circle DOM node 
    cx: number,             // the center x coordinate of the circle 
    cy: number,             // the center y coordinate of the circle 
    r: number,              // the radius of the circle 
    useMotion?: boolean,    // whether or not the DOM node uses framer-motion implementation 
}

const RectGlyph: React.FC<RectGlyphProps> = (props) => {
    const { cx, cy, width, height, useMotion } = props; 
    const otherProps: any = withoutKeys(props, ["cx", "cy", "width", "height"], true, true); 
    const br = 3; // border-radius 
    return useMotion ?  <motion.rect x={cx-width/2} y={cy-height/2} width={width} height={height} { ...otherProps } rx={br} ry={br}/> : 
                        <rect x={cx-width/2} y={cy-height/2} width={width} height={height} { ...otherProps } rx={br} ry={br}/>; 
}; 

const CircleGlyph: React.FC<CircleGlyphProps> = (props) => {
    const { cx, cy, r, useMotion } = props; 
    const otherProps: any = withoutKeys(props, ["cx", "cy", "r"], true, true); 
    return useMotion ?  <motion.circle r={r} cx={cx} cy={cy} { ...otherProps }/> : 
                        <circle r={r} cx={cx} cy={cy} { ...otherProps }/>; 
}; 


const GridGlyph: React.FC<CircleScalableProps> = (props) => {

    const { state, dispatch } = useRootContext(); 
    const { inactiveScaleFactor }: ReducerState = state; 
    const { cx, cy, r, value, rowIndex, colIndex, fillColor } = props; 

    const glyph: string = "rect";

    const glyphProps = {
        background: {
            useMotion: true, 
            fill: colors.glyph_background_color, 
            initial: false, 
            animate: { scale: value ? 1 : inactiveScaleFactor },
            transition: { duration: 0.25 },
            transformTemplate: (transform: any, generatedTransform: any) => `translate(${cx}px,${cy}px) ${generatedTransform}`,
            onClick: () =>  {
                dispatch(['set value habit table', [rowIndex, colIndex, 1]]);
            }
        }, 
        foreground: {
            useMotion: true, 
            fill: fillColor, 
            initial: false, 
            animate: { scale: value ? 1 : 0 },
            transition: { duration: 0.25 },
            transformTemplate: (transform: any, generatedTransform: any) => `translate(${cx}px,${cy}px) ${generatedTransform}`,
            onClick: () =>  {
                dispatch(['set value habit table', [rowIndex, colIndex, 0]]);
            }
        }
    }; 

    let content = null; 
    switch (glyph) {
        case 'circle': 
            content = (
                <React.Fragment>
                    <CircleGlyph cx={0} cy={0} r={r} { ...glyphProps.background }/>
                    <CircleGlyph cx={0} cy={0} r={r} { ...glyphProps.foreground }/> 
                </React.Fragment>        
            ); 
            break; 
        case 'rect':
            content = (
                <React.Fragment>
                    <RectGlyph cx={0} cy={0} width={r*2} height={r*2} { ...glyphProps.background }/>
                    <RectGlyph cx={0} cy={0} width={r*2} height={r*2} { ...glyphProps.foreground }/> 
                </React.Fragment>        
            ); 
            break; 
        default: 
            throw Error("unrecognized glyph type"); 
            break; 
    }

    return content; 

};

export default GridGlyph; 
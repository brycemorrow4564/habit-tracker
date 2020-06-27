import * as React from "react";
import _ from "lodash"; 
import { motion } from "framer-motion"; 
import styled from "styled-components"; 
import { useRootContext } from "../contexts/context"; 
import { withoutKeys } from "../utils/util"; 
import { ReducerState } from "../reducers/reducer";

export interface GridGlyphProps {
    cx: number,         // x coord of origin 
    cy: number,         // y coord of origin
    r: number,          // drawing radius 
    value: number,      // value which determines fill
    delay: number,      // amount of time to delay scaling animation 
    rowIndex: number,   // row index of this circle in single week view grid 
    colIndex: number,   // col index of this circle in single week view grid 
    activeFillColor: string   // the fill color of the foreground 
};

type GlyphType = "circle" | "square"; 
type GlyphPropType = RectGlyphProps | CircleGlyphProps; 

interface GlyphProps {
    className?: string,         // className to pass to underlying DOM node     
    glyphType: GlyphType,       // which Glyph implementation to utilize 
    glyphProps: GlyphPropType,  // the props to pass to our selected Glyph implementation
}; 

interface RectGlyphProps {
    [key: string]: any      // can include other property values to pass through to 
                            // the underlying svg.rect DOM node 
    cx: number,             // the center x coordinate of the rectangle 
    cy: number,             // the center y coordinate of the rectangle 
    width: number,          // the width of the rectangle 
    height: number,         // the height of the rectangle 
    className?: string, 
};

interface CircleGlyphProps {
    [key: string]: any      // can include other property values to pass through to 
                            // the underlying svg.circle DOM node 
    cx: number,             // the center x coordinate of the circle 
    cy: number,             // the center y coordinate of the circle 
    r: number,              // the radius of the circle 
    className?: string, 
}

const RectGlyph: React.FC<RectGlyphProps> = (props) => {
    const { cx, cy, width, height, className } = props; 
    const otherProps: any = withoutKeys(props, ["cx", "cy", "width", "height"], true, true); 
    const br = 3; // border-radius 
    return <motion.rect className={className} x={cx-width/2} y={cy-height/2} width={width} height={height} { ...otherProps } rx={br} ry={br}/>; 
}; 

const CircleGlyph: React.FC<CircleGlyphProps> = (props) => {
    const { cx, cy, r, className } = props; 
    const otherProps: any = withoutKeys(props, ["cx", "cy", "r"], true, true); 
    return <motion.circle className={className} r={r} cx={cx} cy={cy} { ...otherProps }/>;
}; 

const Glyph: React.FC<GlyphProps> = ({ glyphProps, glyphType, className }) => {
    let content = null;
    switch (glyphType) {
        case "circle": 
            content = <CircleGlyph { ...(glyphProps as CircleGlyphProps) } className={className}/>; 
            break; 
        case "square": 
            content = <RectGlyph { ...(glyphProps as RectGlyphProps) } className={className}/>; 
            break; 
        default: 
    }
    return content; 
}; 

const StyledGlyph = styled(Glyph)<{ isForeground: boolean, activeFill: string }>`
    fill: ${props => (props.isForeground ? props.activeFill : props.theme.glyph_background_color )};
`;

const GridGlyph: React.FC<GridGlyphProps> = (props) => {

    const { state, dispatch } = useRootContext(); 
    const { inactiveScaleFactor }: ReducerState = state; 
    const { cx, cy, r, value, rowIndex, colIndex, activeFillColor } = props; 

    const glyph: GlyphType = "square";

    // Props shared by all DOM nodes that comprise the glyph 
    const sharedProps = {
        // properties used by framer-motion DOM node for animations 
        initial: false, 
        transformTemplate: (transform: any, generatedTransform: any) => `translate(${cx}px,${cy}px) ${generatedTransform}`,
        transition: { duration: 0.25 }, 
        // position / dimension values for glyph implementations to utilize 
        ...({ cx: 0, cy: 0, r, width: r*2, height: r*2 }) 
    }; 

    // Props specific to the different subtypes of DOM nodes that comprise the glyph 
    const glyphProps = {
        background: {
            animate: { scale: value ? 1 : inactiveScaleFactor },
            onClick: () =>  {
                dispatch(['set value habit table', [rowIndex, colIndex, 1]]);
            }
        }, 
        foreground: {
            animate: { scale: value ? 1 : 0 },
            onClick: () =>  {
                dispatch(['set value habit table', [rowIndex, colIndex, 0]]);
            }
        }
    }; 

    const foregroundProps: GlyphPropType = _.merge(glyphProps.foreground, sharedProps); 
    const backgroundProps: GlyphPropType = _.merge(glyphProps.background, sharedProps); 

    return (
        <React.Fragment>
            <StyledGlyph glyphType={glyph} glyphProps={backgroundProps} isForeground={false} activeFill={activeFillColor}/>
            <StyledGlyph glyphType={glyph} glyphProps={foregroundProps} isForeground={true} activeFill={activeFillColor}/>
        </React.Fragment>
    ); 

};

export default GridGlyph; 
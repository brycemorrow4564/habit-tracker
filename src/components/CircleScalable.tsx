import * as React from "react";
import _ from "lodash"; 
import { easeCubic, easeSinIn } from 'd3-ease'; 
import { useRootContext } from "../context"; 

const minOpacity = .15; 

export interface CircleScalableProps {
    cx: number,         // x coord of origin 
    cy: number,         // y coord of origin
    r: number,          // radius of circle
    value: number,      // value which determines fill
    delay: number,      // amount of time to delay scaling animation 
    rowIndex: number    // row index of this circle in single week view grid 
    colIndex: number    // col index of this circle in single week view grid 
};

const activeColor = "#47c85c" ; 
const inactiveColor = "#eeeae8";

const CircleScalable: React.FC<CircleScalableProps> = (props) => {

    const { state, dispatch } = useRootContext(); 
    const { minScale, maxScale, cellWidth } = state; 
    const { cx, cy, r, value, delay, rowIndex, colIndex } = props; 
    const [opacity, setOpacity] = React.useState<number>(minOpacity); 
    const [transformStr, setTransformStr] = React.useState<string>(`translate(${-cellWidth},${cy}) 
                                                                    scale(${minScale})`); 

    React.useEffect(() => {

        let startTime: number = 0;
        let frame: number = 0;

        let scaleDuration = 1250; 
        let opacityDuration = 1250;
        let translateDuration = 1500;

        function ticked(timestamp: number) {
            if (!startTime) startTime = timestamp;

            const elapsed = timestamp - startTime;
            const scaleT = Math.min(1, elapsed / scaleDuration);
            const translateT = Math.min(1, elapsed / translateDuration); 
            const opacityT = Math.min(1, elapsed / opacityDuration);

            if (elapsed < Math.max(...[scaleDuration, translateDuration, opacityT])) {
                // if the elapsed time is less than the duration, continue the animation
                const transformStr = getTransformString(scaleT, translateT);
                setTransformStr(transformStr); 
                setOpacity(easeSinIn(opacityT) * (1-minOpacity) + minOpacity); 
                frame = requestAnimationFrame(ticked);
            }
        };

        function getTransformString(scaleT: number, translateT: number): string {
            let tScaleNorm = easeSinIn(scaleT); 
            let tTranslateNorm = easeCubic(translateT); 
            let scaleRange: number =  maxScale - minScale;
            return `translate(${cx * tTranslateNorm}, ${cy}) 
                    scale(${scaleRange * tScaleNorm + minScale})`;
        }

        setTimeout(() => {
            requestAnimationFrame(ticked);
        }, delay);

        return () => cancelAnimationFrame(frame); 
        

    }, [minScale, maxScale, delay]); 

    let handleClick = () => {
        dispatch(['set dataRowCol', [rowIndex, colIndex, value === 1 ? 0 : 1]]); 
    }; 

    return (
        <circle
        onClick={handleClick}
        transform={transformStr}
        opacity={opacity}
        cx={0}
        cy={0}
        r={r}
        fill={value === 1 ? activeColor : inactiveColor}/>
    ); 
};

export default CircleScalable; 
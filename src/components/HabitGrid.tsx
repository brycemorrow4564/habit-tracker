import * as React from "react";
import useDimensions from "react-use-dimensions";
import { scaleLinear } from "d3-scale"; 
import _ from "lodash"; 
import GridCellBinary from "./GridCellBinary";
import { useRootContext } from "../contexts/context"; 

/*
A graphical component that allows for the grid-based display 
that represents a history of a behavior 
*/

export interface HabitGridProps { 
    name: string;                   // primary key of habit this grid is showing data for 
    data: number[];                 // array of values (0 or 1) indicating if habit was maintained 
                                    // on a given day 
    temporalRange: [Date, Date];    // [startDate, endDate]
};

// function computeRectangleAtPoint(x: number, y: number, w: number, h: number) {
//     return [[x-w/2,y-h/2],[x+w/2,y+h/2]];
// }; 

const HabitGrid: React.FC<HabitGridProps> = (props) => {

    const { state } = useRootContext(); 
    const { cellWidth, cellHeight, period } = state; 

    const { data } = props;
    
    // const [gridCellPaddingRatio, setGridCellPaddingRatio] = React.useState<number>(.1); 
    // const [svgPaddingRatio, setSvgPaddingRatio] = React.useState<{ top: number, bottom: number, left: number, right: number }>({ top: .1, bottom: .1, left: .1, right: .1 });

    // const [ref, { width, height }] = useDimensions();

    // compute dimensions of glyphs using user defined parameters 
    // const numRows = Math.ceil(data.length / numCols); 
    // const cw2 = cellWidth / 2; 
    // const ch2 = cellHeight / 2; 

    return (
        <div style={{ width: period * cellWidth }}>
            <div className="habit-grid">
                {_.range(0, data.length).map(i => <GridCellBinary height={cellHeight} width={cellWidth} />)}
            </div>
        </div> 
    ); 
};

export default HabitGrid; 
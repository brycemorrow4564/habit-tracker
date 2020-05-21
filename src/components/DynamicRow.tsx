import * as React from "react";
import _ from "lodash"; 
import CircleScalable from './CircleScalable'; 
import { useRootContext } from "../context"; 

export interface DynamicRowProps { 
    data: number[], 
    rowIndex: number
};

const DynamicRow: React.FC<DynamicRowProps> = (props) => {

    const { state } = useRootContext(); 
    const { cellWidth, cellHeight, windowSize, singleWeekXAnchors } = state; 
    const { data, rowIndex } = props; 

    let delayUnit = 1000 / (windowSize-1) + rowIndex * 30; 
          
    return !singleWeekXAnchors ? null : (
        <svg style={{ height: cellHeight, width: '100%', display: 'block' }}>
            {_.reverse(data.map((d, i) => {
                return (
                    <CircleScalable
                    rowIndex={rowIndex}
                    colIndex={i}
                    cx={singleWeekXAnchors[i]}
                    cy={cellHeight / 2}
                    r={cellWidth / 2 - 1}
                    value={d}
                    delay={delayUnit * i}/>
                )
            }))}
        </svg> 
    ); 
};

export default DynamicRow; 
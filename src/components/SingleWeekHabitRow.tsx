import * as React from "react";
import _ from "lodash"; 
import { Row, Col } from "antd"; 
import CircleScalable from './CircleScalable';
import { ReactComponent as FireSvg } from '../fire19.svg';
import { useRootContext } from "../context"; 

export interface SingleWeekHabitRowProps {
    data: number[], 
    index: number 
};

class GridMatrix {

    private data: any[]; 

    constructor(public nRows: number, public nCols: number) {
        this.data = new Array(nRows * nCols); 
        this.zero(); 
    }

    getElement1D(i: number) {
        return this.data[i];
    }

    setElement1D(i: number, value: any) {
        this.data[i] = value;
    }

    getElement2D(i: number, j: number) {
        return this.data[i*this.nCols + j];
    }

    setElement2D(i: number, j: number, value: any) {
        this.data[i*this.nCols + j] = value;
    }

    zero() {
        this.data.fill(0); 
    }

}

const SingleWeekHabitRow: React.FC<SingleWeekHabitRowProps> = (props) => {

    const { state } = useRootContext(); 
    const { singleWeekViewOffset, cellWidth, cellHeight, windowSize, singleWeekXAnchors, numHabits } = state; 
    const { data, index } = props; 

    let delayUnit = 1000 / (windowSize-1) + index * 30; 
    let grid = new GridMatrix(numHabits, 7); 
    
    return (
        <Row justify="start" align="middle" className="single-week-habit-row">
            
            {/* Habit Label */}
            <Col span={singleWeekViewOffset}>
                <Row justify="end" align="middle" style={{ height: cellHeight, width: "100%", paddingRight: '1em' }}>
                <Col span={24}>
                    <p className="habit-name-labels">{`Habit ${index+1}`}</p>
                </Col>
                </Row>
            </Col>

            {/* Habit history visualization */}
            <Col span={24 - 2 * singleWeekViewOffset}>

            {!singleWeekXAnchors ? null : (
                <svg style={{ height: cellHeight, width: '100%', display: 'block' }}>
                    {data.map((d, i) => {
                        return (
                            <CircleScalable
                            
                            rowIndex={index}
                            colIndex={i}

                            cx={singleWeekXAnchors[i]}
                            cy={cellHeight / 2}
                            r={cellWidth / 2 - 1}
                            value={d}
                            delay={delayUnit * i}
                            
                            />
                        )
                    })}
                </svg> 
            )}
            </Col> 

            {/* Streak Visualization */}
            <Col span={singleWeekViewOffset}>
                <Row justify="start" align="top">
                    <Col>
                        <FireSvg style={{ height: 20, width: 20 }}/>
                    </Col>
                    <Col>
                        <svg style={{ height: 20, width: 40 }}>
                            <text x={0} y={18}>0</text>
                        </svg>
                    </Col>
                </Row>
                
            </Col>
        </Row>
    ); 
};

export default SingleWeekHabitRow; 
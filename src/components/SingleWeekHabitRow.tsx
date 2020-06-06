import * as React from "react";
import _ from "lodash"; 
import { Row, Col } from "antd"; 
import CircleScalable from './CircleScalable';
import { ReactComponent as FireSvg } from '../assets/fire19.svg';
import { useRootContext } from "../contexts/context"; 
import { HabitHistory, HabitTable, WeeksWindower } from "../utils/time"; 

export interface SingleWeekHabitRowProps {
    habitName: string
};

const SingleWeekHabitRow: React.FC<SingleWeekHabitRowProps> = (props) => {

    const { habitName } = props;
    const { state } = useRootContext(); 
    const { 
        habitTable, 
        weeksWindower, 
        xAnchors, 
        yAnchors
    } = state; 

    let data: Array<{ index: number, date: moment.Moment, value: any }> = habitTable.get(habitName, weeksWindower.start, weeksWindower.end); 
    
    return (
        <Row className="single-week-habit-row">
            <Col span={24}>
            {(
                <svg style={{ height: 50, width: '100%', display: 'block' }}>
                    {data.map(({ value, index }, i) => (
                        <CircleScalable
                        rowIndex={index}
                        colIndex={i}
                        cx={40*i}
                        cy={yAnchors ? yAnchors[0] : 0}
                        r={10}
                        value={value}
                        delay={0} />
                    ))}
                </svg> 
            )}
            </Col> 

            {/* Streak Visualization */}
            {/* <Col span={singleWeekViewOffset}>
                <Row justify="start" align="top">
                    <Col>
                        <FireSvg className={'streak-icon'} style={{ height: 20, width: 20 }}/>
                    </Col>
                    <Col>
                        <svg className="streak-amount-container" style={{ height: 20, width: 40 }}>
                            <text x={0} y={18} className="streak-amount">0</text>
                        </svg>
                    </Col>
                </Row>
            </Col> */}

        </Row>
    ); 
};

export default SingleWeekHabitRow; 
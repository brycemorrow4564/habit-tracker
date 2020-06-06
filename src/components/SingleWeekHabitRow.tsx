import * as React from "react";
import _ from "lodash"; 
import { Row, Col } from "antd"; 
import CircleScalable from './CircleScalable';
import { ReactComponent as FireSvg } from '../assets/fire19.svg';
import { useRootContext } from "../contexts/context"; 
import { HabitHistory, HabitTable, WeeksWindower } from "../utils/time"; 

export interface SingleWeekHabitRowProps {
    habitName: string, 
    rowIndex: number
};

const SingleWeekHabitRow: React.FC<SingleWeekHabitRowProps> = (props) => {

    const { habitName, rowIndex } = props;
    const { state } = useRootContext(); 
    const { 
        habitTable, 
        weeksWindower, 
        rowHeights, 
        rowMarginBottom, 
        colWidths, 
        timeAxisItemSpacing
    } = state; 

    const ready: boolean = rowHeights.length && colWidths.length; 
    const data: Array<{ index: number, date: moment.Moment, value: any }> = habitTable.get(habitName, weeksWindower.start, weeksWindower.end); 
    
    const zeros: Array<number> = data.map(e => 0); 
    // @ts-ignore
    const x0s: Array<number> = colWidths.length ? colWidths.reduce((acc,cur,i) => {
        acc[i] = i === 0 ? 0 : acc[i-1] + colWidths[i-1] + timeAxisItemSpacing; 
        return acc
    }, []) : zeros.slice(); 
    const x1s: Array<number> = colWidths.length ? x0s.map((cur,i) => cur + colWidths[i]) : zeros.slice(); 
    const xs = data.map((d,i) => (x0s[i]+x1s[i])/2); 

    return !ready ? null : (
        <Row className="single-week-habit-row">
            <Col span={24}>
                <svg className="habit-row-viz" style={{ height: rowHeights[rowIndex], width: '100%', display: 'block' }}>
                    {data.map(({ date, value, index }, i) => (
                        <CircleScalable
                        key={`${date.format()}-${index}`}
                        rowIndex={index}
                        colIndex={i}
                        cx={xs[i]}
                        cy={rowHeights[rowIndex] / 2}
                        r={10}
                        value={value}
                        delay={0} />
                    ))}
                </svg>
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
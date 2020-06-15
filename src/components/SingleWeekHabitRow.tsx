import * as React from "react";
import _ from "lodash"; 
import { Row, Col } from "antd"; 
import CircleScalable from './CircleScalable';
import { ReactComponent as FireSvg } from '../assets/fire19.svg';
import { useRootContext } from "../contexts/context"; 
import { ReducerState } from "../reducers/reducer"; 
import TweenProvider from "../tween-engine/TweenProvider"; 
import { colors } from "../utils/color";

export interface SingleWeekHabitRowProps {
    habitName: string, 
    rowIndex: number
};

const SingleWeekHabitRow: React.FC<SingleWeekHabitRowProps> = (props) => {

    const { habitName, rowIndex } = props;
    const { state } = useRootContext(); 
    const { 
        habitTable, 
        habitRegistry, 
        labelsColorsBijection, 
        weeksWindower, 
        rowHeights, 
        rowMarginBottom, 
        colWidths, 
        timeAxisItemSpacing,
        today
    }: ReducerState = state; 

    const ready: boolean = (rowHeights.length && colWidths.length && rowIndex < rowHeights.length) as boolean; 
                           
    const data: Array<{ index: number, date: moment.Moment, value: any }> = habitTable.get(habitName, weeksWindower.start(), weeksWindower.end()); 
    const streak: Array<[number,number]> = habitTable.streak(habitName, weeksWindower.start(), weeksWindower.end()); 

    const zeros: Array<number> = data.map(e => 0); 
    // @ts-ignore
    const x0s: Array<number> = colWidths.length ? colWidths.reduce((acc,cur,i) => {
        // @ts-ignore
        acc[i] = i === 0 ? 0 : acc[i-1] + colWidths[i-1] + timeAxisItemSpacing; 
        return acc
    }, []) : zeros.slice(); 
    const x1s: Array<number> = colWidths.length ? x0s.map((cur,i) => cur + colWidths[i]) : zeros.slice(); 
    const xs = x0s.map((d,i) => (x0s[i]+x1s[i])/2); 

    const HEIGHT = 10; 
    const color = labelsColorsBijection.getMappedValue('labels', habitRegistry.getLabel(habitName));

    // Compute streak 
    // TODO: integrate this logic with the HabitTable implementation 
    let currentStreakEndArr: Array<number | null> = data.map(({ date, index, value }) => date.isSame(today, 'days') && value === 1 ? index : null).filter(e => e !== null); 
    let hasCurrStreak: boolean = currentStreakEndArr.length === 1; 
    let streakCount: number = 0; 
    if (hasCurrStreak) {
        let streakEndIndex: number = currentStreakEndArr[0] as number; 
        let si: number = streakEndIndex - 1; 
        streakCount = 1; 
        while (si >= 0) {
            if (data[si].value === 1) {
                streakCount += 1; 
                si -= 1; 
            } else {
                break;
            }
        }
    }; 

    let svgStyle = { 
        height: rowHeights[rowIndex], 
        width: '100%', 
        display: 'block', 
        // background: colors.primary.dark 
    }; 
    
    return !ready ? null : (
        <Row className="single-week-habit-row">
            <Col span={24}>
                <svg className="habit-row-viz" style={svgStyle}>
                    
                    {/* links */}
                    {streak.map(([i0,i1]) => <rect key={`${i0}-${i1}`} fill={color} width={xs[i1]-xs[i0]} height={HEIGHT} x={xs[i0]-HEIGHT} y={rowHeights[rowIndex] / 2}/>)}
                    
                    {/* glyphs */}
                    <TweenProvider>
                        {data.map(({ date, value, index }, i) => (
                            <React.Fragment key={`${date.format()}-${index}`}>
                                <CircleScalable
                                
                                fillColor={color}
                                rowIndex={rowIndex}
                                colIndex={i}
                                cx={xs[i]}
                                cy={rowHeights[rowIndex] / 2}
                                r={(rowHeights[rowIndex] / 2) * .7}
                                value={value}
                                delay={0} />
                                
                                {!(date.isSame(today, 'days') && hasCurrStreak) ? null : <text fontSize={22} fill="#fff" x={xs[i]} y={rowHeights[rowIndex] / 2}>{`${streakCount}`}</text>}
                            </React.Fragment>
                        ))}
                    </TweenProvider>
                    
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
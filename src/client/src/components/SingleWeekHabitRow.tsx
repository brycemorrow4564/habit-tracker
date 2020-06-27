import * as React from "react";
import _ from "lodash"; 
import { Row, Col } from "antd"; 
import GridGlyph from './GridGlyph';
import { useRootContext } from "../contexts/context"; 
import { ReducerState, Habit } from "../reducers/reducer"; 
import { colors } from "../utils/color";

import "../css/SingleWeekHabitRow.css"; 

export interface SingleWeekHabitRowProps {
    habitName: string, 
    rowIndex: number
};

const SingleWeekHabitRow: React.FC<SingleWeekHabitRowProps> = (props) => {

    const { habitName, rowIndex } = props;
    const { state } = useRootContext(); 
    const { 
        habitTable, 
        habitMap, 
        weeksWindower, 
        rowHeights, 
        xCoords, 
        today
    }: ReducerState = state; 

    const ready: boolean = (rowHeights.length && xCoords.length && rowIndex < rowHeights.length) as boolean; 
                           
    const data: Array<{ index: number, date: moment.Moment, value: any }> = habitTable.get(habitName, weeksWindower.start(), weeksWindower.end()); 
    const streak: Array<[number,number]> = habitTable.streak(habitName, weeksWindower.start(), weeksWindower.end()); 
    const HEIGHT = 10; 

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
        display: 'block'
    }; 

    const habit: Habit = habitMap.get(habitName) as Habit; 
    const fillColor: string = habit.color; 
    
    return !ready ? null : (
        <Row className="single-week-habit-row">
            <Col span={24} style={colors.gridRowContainerPadding}>
                <svg className="habit-row-viz" style={svgStyle}>
                    
                    {/* links */}
                    {streak.map(([i0,i1]) => <rect key={`${i0}-${i1}`} fill={fillColor} width={xCoords[i1]-xCoords[i0]} height={HEIGHT} x={xCoords[i0]-HEIGHT} y={rowHeights[rowIndex] / 2}/>)}
                    
                    {/* glyphs */}
                    {data.map(({ date, value, index }, i) => (
                        <React.Fragment key={`${date.format()}-${index}`}>
                            <GridGlyph
                            activeFillColor={fillColor}
                            rowIndex={rowIndex}
                            colIndex={i}
                            cx={xCoords[i]}
                            cy={rowHeights[rowIndex] / 2}
                            r={(rowHeights[rowIndex] / 2) * .7}
                            value={value}
                            delay={0} />
                            
                            {!(date.isSame(today, 'days') && hasCurrStreak) ? null : <text fontSize={22} fill="#fff" x={xCoords[i]} y={rowHeights[rowIndex] / 2}>{`${streakCount}`}</text>}
                        </React.Fragment>
                    ))}
                    
                </svg>
            </Col> 

        </Row>
    ); 
};

export default SingleWeekHabitRow; 
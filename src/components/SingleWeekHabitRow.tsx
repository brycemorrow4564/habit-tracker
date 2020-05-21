import * as React from "react";
import { Row, Col } from "antd"; 
import { useRootContext } from "../context"; 

import DynamicRow from "./DynamicRow"; 

export interface SingleWeekHabitRowProps {
    data: number[], 
    index: number 
};

const SingleWeekHabitRow: React.FC<SingleWeekHabitRowProps> = (props) => {

    const { state } = useRootContext(); 
    const { singleWeekViewOffset, cellHeight, windowSize } = state; 
    const { data, index } = props; 
    
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
            {/*  */}
            <Col span={24 - 2 * singleWeekViewOffset}>
                <DynamicRow data={data.slice(0, windowSize)} rowIndex={index}/>
            </Col> 
        </Row>
    ); 
};

export default SingleWeekHabitRow; 
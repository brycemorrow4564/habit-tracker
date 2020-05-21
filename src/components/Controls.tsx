

import * as React from "react";
import { Slider, Row, Col, Button } from "antd";
import { useRootContext } from "../context"; 

/*
A graphical component that allows for the grid-based display 
that represents a history of a behavior 
*/

export interface ControlsProps { 

};

const Controls: React.FC<ControlsProps> = (props) => {

    const { state, dispatch } = useRootContext(); 
    const { period, windowSize } = state; 

    const numWeeks = [1, 2, 3]; 
    const getClassName = (numWeeks : number) => {
        let numDays = numWeeks * 7;
        return numDays === windowSize ? 'window-btn selected-window-btn' : 'window-btn'
    }

    return (

        <Row justify="center" align="middle">
            <Col span={8}>
                <Row justify="center" align="middle">
                    <div className="window-selection-btns">
                        {numWeeks.map(v => (
                            <Button 
                            ghost 
                            onClick={value => dispatch(['set windowSize', v*7])}  
                            className={getClassName(v)}>{`${v} Week`}</Button>
                        ))}
                    </div>
                </Row>             
            </Col> 
        </Row>
    );
};

export default Controls; 
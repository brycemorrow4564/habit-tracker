import * as React from "react"; 
import _ from "lodash"; 
import { Row, Col } from "antd"; 
import styled from 'styled-components';

export interface HabitCardContentProps {
    className?: string, 
    habitName: string, 
    habitFrequency: string
};


const HabitCardContent: React.FC<HabitCardContentProps> = ({ className, habitName, habitFrequency }) => {
    return (
        <div className={className}>
            <p style={{ marginBottom: 0, fontSize: 16, fontWeight: 500 }}>{habitName}</p>
            <div/>
            <Row justify="space-between" align="middle">
                <Col>
                    <p style={{ color: '#999999', marginBottom: 0 }}>{habitFrequency}</p>
                </Col>
            </Row>
        </div>
    );
};

const StyledHabitCardContent = styled(HabitCardContent)`
    padding: .5em .75em .5em 2.5em; 
`;

export default StyledHabitCardContent; 
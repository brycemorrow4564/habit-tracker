import * as React from "react"; 
import { PlusCircleOutlined, EditOutlined } from "@ant-design/icons";  
import { scaleLinear } from "d3-scale";
import useDimensions from "react-use-dimensions"; 
import _ from "lodash"; 
import moment from "moment"; 
import { Row, Col, List, Input, Tag } from "antd"; 
import { colors } from "../utils/color";
import { ReducerState } from "../reducers/reducer"; 
import { createHabit } from "../rest/rest"; 

/*
The time axis for the habit table viewer 
*/

export interface HabitCardProps {
    habitName: string, 
    cardRefs: any
}

const HabitCard: React.FC<HabitCardProps> = (props) => {

  const { habitName, cardRefs } = props; 

  return (
    <Row key={habitName}>
        <Col span={24} style={{ marginBottom: 2 }}>
            <div style={{ background: colors.background }}>
                <div className="habit-card">
                    <p style={{ marginBottom: 0, fontSize: 16, fontWeight: 500 }}>{habitName}</p>
                    <div ref={ref => cardRefs.current[habitName] = ref}/>
                    <Row justify="space-between" align="middle">
                    <Col>
                        <p style={{ color: '#999999', marginBottom: 0 }}>daily</p>
                    </Col>
                    <Col>
                        <Tag color={
                            'volcano'
                                // labelsColorsBijection.getMappedValue('labels', habitRegistry.getLabel(habitName))
                        } style={{ marginRight: 0 }}>{"thing"}</Tag>
                    </Col>
                    </Row>
                </div>
            </div>
        </Col>
    </Row>
  );
}

export default HabitCard;

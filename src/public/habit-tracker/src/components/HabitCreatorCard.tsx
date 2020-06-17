import * as React from "react"; 
import _ from "lodash"; 
import { PlusCircleOutlined, CheckOutlined } from "@ant-design/icons";  
import { Row, Col, Input, Button, Form } from "antd"; 

import { colors } from "../utils/color";
import { ReducerState } from "../reducers/reducer";
import { useRootContext } from "../contexts/context"; 
import { createHabit } from "../rest/rest"; 

export interface HabitCreatorCardProps {

}

const HabitCreatorCard: React.FC<HabitCreatorCardProps> = (props) => {

  const { state, dispatch } = useRootContext(); 
  const { user_id, habitTable }: ReducerState = state; 
  const [formActive, setFormActive] = React.useState<boolean>(false); 

  let createHabitRest = async (new_habit_id: string) => {
    dispatch(['create habit', await createHabit(user_id, new_habit_id)]);
    setFormActive(false); 
  }; 

  const wrapContent = (content: any) => (
    <Row>
        <Col span={24}>
          <div style={{ background: colors.background }}>
              <div className="habit-card">
                {content}
              </div>
          </div>
        </Col>
    </Row>
  ); 

  // Stateful button that when clicked shows form for creating a new habit 
  const formInactiveContent = wrapContent(
    <Row justify="space-around" align="middle">
        <Col>
        <PlusCircleOutlined 
        style={{ color: colors.primary.dark }}
        translate={0} 
        onClick={() => setFormActive(true)}/>
        <p style={{ display: 'inline-block', color: colors.primary.dark, marginLeft: '.3em' }}>New Habit</p>
        </Col>
    </Row>
  ); 

  let onFinish = (values: any) => {
    let new_habit_id = values.name; 
    createHabitRest(new_habit_id); 
  }; 

  let onFinishFailed = () => {
    console.log("FAILURE"); 
  }; 

  let validator = async (rule: any, value: any) => {
    if (!value) {
      return Promise.reject("empty name"); 
    } else {
      value = (value as string).trim(); 
      if (value.length === 0) {
        return Promise.reject("empty name"); 
      } else if (habitTable.getNames().includes(value)) {
        return Promise.reject('duplicate name');
      } else {
        return Promise.resolve();    
      }
    }                                                        
  }

  // form for creating a new habit 
  const formActiveContent = wrapContent(
    <Form name="create-habit" onFinish={onFinish} onFinishFailed={onFinishFailed}>

      {/* Input for name of habit */}
      <Form.Item name="name" rules={[{ validator }]}>
        <Input size="small" placeholder="Habit Name"/>
      </Form.Item>

      {/* Button to submit the form */}
      <Form.Item>
        <Button htmlType="submit">create</Button>
      </Form.Item>

    </Form>
  ); 

  return formActive ? formActiveContent : formInactiveContent; 

}

export default HabitCreatorCard;

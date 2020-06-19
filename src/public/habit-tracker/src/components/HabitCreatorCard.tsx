import * as React from "react"; 
import _ from "lodash"; 
import { PlusCircleOutlined, CheckOutlined } from "@ant-design/icons";  
import { Row, Col, Input, Button, Form } from "antd"; 
import Box from "./Box"; 
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
    <Box span={24}>
      <div style={{ background: colors.grey[2] }}>
          <div className="habit-card">
            {content}
          </div>
      </div>
    </Box>
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

  // Stateful button that when clicked shows form for creating a new habit 
  const formInactiveContent = wrapContent(
    <Box horizontal="space-around" vertical="middle">
      <Row justify="space-around" align="middle">
          <Col>
            <PlusCircleOutlined 
            style={{ color: colors.habitlist_title_color }}
            translate={0} 
            onClick={() => setFormActive(true)}/>
          </Col>
          <Col style={{ marginLeft: 5 }}>
            <p style={{ color: colors.habitlist_title_color, margin: 0 }}>New Habit</p>
          </Col>
      </Row>
    </Box>
  ); 

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

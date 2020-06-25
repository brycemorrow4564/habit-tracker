import * as React from "react"; 
import _ from "lodash"; 
import { PlusCircleOutlined, CheckOutlined } from "@ant-design/icons";  
import { Row, Col, Input, Button, Form, Modal } from "antd"; 
import Box from "./Box"; 
import { colors } from "../utils/color";
import { ReducerState } from "../reducers/reducer";
import { useRootContext } from "../contexts/context"; 
import { createHabit } from "../rest/rest"; 

export interface CreateHabitModalProps { 

};  

const CreateHabitModal: React.FC<CreateHabitModalProps> = (props) => {

    const [form] = Form.useForm();
    const { state, dispatch } = useRootContext(); 
    const { user_id, habitTable, createModalVisible }: ReducerState = state; 

    let close = () => dispatch(['set create modal hidden']); 
  
    let createHabitRest = async (new_habit_id: string) => {
      dispatch(['create habit', await createHabit(user_id, new_habit_id)]);
    }; 

    let onFinish = (values: any) => {
        let new_habit_id: string = values.name; 
        createHabitRest(new_habit_id); 
    }; 

    let onFinishFailed = () => {
        console.log("FAILURE"); 
    }; 

    let validator = async (rule: any, value: any) => {
        let s: string; 
        if (!_.isString(value)) {
            return Promise.reject("empty name"); 
        } else {
            s = (value as string).trim(); 
            if (s.length === 0) {
                return Promise.reject("empty name"); 
            } else if (habitTable.getNames().includes(s)) {
                return Promise.reject('duplicate name');
            } else {
                return Promise.resolve();    
            }
        }   
    }

    return (
        <Modal
        title="Create Habit"
        visible={createModalVisible}
        onOk={() => {
            form.submit();
            close(); 
        }}
        onCancel={() => {
            form.resetFields(); 
            close();
        }}>
            <Form name="create-habit" form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <Box horizontal="center" vertical="middle" span={12}>
                    <div>
                        <Form.Item name="name" label="Habit Name" rules={[{ validator }]}>
                            <Input size="small"/>
                        </Form.Item>
                    </div>
                </Box>
            </Form>
        </Modal>    
    ); 

}; 

export default CreateHabitModal; 
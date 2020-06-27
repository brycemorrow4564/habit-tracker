import * as React from "react"; 
import _ from "lodash"; 
import { Input, Form, Modal } from "antd"; 
import Box from "./Box"; 
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
    
    const callbacks = {
        modal: {
            onOk: () => {
                form.submit();
                close(); 
            }, 
            onCancel: () => {
                form.resetFields(); 
                close();
            }
        }, 
        form: {
            onFinish: (values: any) => {
                createHabit(user_id, values.name).then((habit) => dispatch(['create habit', habit]));
            }, 
            onFinishFailed: () => {
                console.log("FAILURE"); 
            }, 
            validator: async (rule: any, value: any) => {
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
        }
    }

    return (
        <Modal 
        title="Create Habit" 
        visible={createModalVisible}
        onOk={callbacks.modal.onOk}
        onCancel={callbacks.modal.onCancel}>
            <Form 
            name="create-habit" 
            form={form} 
            onFinish={callbacks.form.onFinish} 
            onFinishFailed={callbacks.form.onFinishFailed}>
                <Box horizontal="center" vertical="middle" span={12}>
                    <div>
                        <Form.Item name="name" label="Habit Name" rules={[{ validator: callbacks.form.validator }]}>
                            <Input size="small"/>
                        </Form.Item>
                    </div>
                </Box>
            </Form>
        </Modal>    
    ); 

}; 

export default CreateHabitModal; 
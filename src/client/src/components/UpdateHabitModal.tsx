import * as React from "react"; 
import _ from "lodash"; 
import { PlusCircleOutlined, CheckOutlined } from "@ant-design/icons";  
import { Row, Col, Input, Button, Form, Modal } from "antd"; 
import Box from "./Box"; 
import { colors } from "../utils/color";
import { ReducerState } from "../reducers/reducer";
import { useRootContext } from "../contexts/context"; 
import { updateHabit } from "../rest/rest"; 

export interface UpdateHabitModalProps { 

};  

const UpdateHabitModal: React.FC<UpdateHabitModalProps> = (props) => {

    const [form] = Form.useForm();
    const { state, dispatch } = useRootContext(); 
    const { user_id, habitTable, updateModalVisible, updateHabitId }: ReducerState = state; 
    const [localHabitName, setLocalHabitName] = React.useState<string>(updateHabitId as string); 

    // Populate form with values based on which of the 
    // habit cards was clicked 
    React.useEffect(() => {
        if (updateModalVisible) {
            setLocalHabitName(state.updateHabitId); 
        }
    }, [updateModalVisible]); 

    let close = () => dispatch(['set update modal hidden']); 
  
    let updateHabitRest = async ([oldHabitId, newHabitId]: [string, string]) => {
        let { success, habit } = await updateHabit(user_id, oldHabitId, newHabitId);
        if (success) {
            dispatch(['update habit', [oldHabitId, habit]]);
        } else {

        }
    }; 

    let onFinish = (values: any) => {
        let oldHabitId: string = updateHabitId as string; 
        let newHabitId: string = values.name; 
        updateHabitRest([oldHabitId, newHabitId]); 
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

    return (
        <Modal
        title="Update Habit"
        visible={updateModalVisible}
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
                            <Input size="small" allowClear defaultValue={localHabitName} value={localHabitName} onChange={(e) => {
                                setLocalHabitName(e.target.value); 
                            }}/>
                        </Form.Item>
                    </div>
                </Box>
            </Form>
        </Modal>    
    ); 

}; 

export default UpdateHabitModal; 
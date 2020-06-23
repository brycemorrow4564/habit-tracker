import * as React from "react"; 
import _, { valuesIn } from "lodash"; 
import { Row, Col, Input, Button, Form, Modal } from "antd"; 
import { TwitterPicker } from "react-color"; 
import Box from "./Box"; 
import { colors } from "../utils/color";
import { ReducerState, Habit } from "../reducers/reducer";
import { useRootContext } from "../contexts/context"; 
import { updateHabit } from "../rest/rest";

export interface UpdateHabitModalProps { 

};  

export interface ColorSelectionControlProps {
    value?: string;
    onChange?: (value: string) => void;
}

const ColorSelectionControl: React.FC<ColorSelectionControlProps> = ({ value, onChange }) => {

    const { state } = useRootContext(); 
    const { labelColors }: ReducerState = state; 
    const [swatchActive, setSwatchActive] = React.useState<boolean>(false); 
    const [localColor, setLocalColor] = React.useState<string>(value ? value : ''); 

    let handleClick = () => {
        setSwatchActive(!swatchActive); 
    };

    let handleClose = () => {
        setSwatchActive(false); 
    };

    let handleChange = (color: any) => {
        if (onChange) {
            // locally record change 
            setLocalColor(color.hex); 
            // pass changed value to the form parent 
            onChange(color.hex); 
        }
    };

    const styles: any = {
        color: {
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            background: localColor,
        },
        swatch: {
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
        },
        popover: {
            position: 'absolute',
            zIndex: '2',
        },
        cover: {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        },
    };

    return (
        <div>
            <div style={ styles.swatch } onClick={ handleClick }>
                <div style={ styles.color } />
            </div>
            {!swatchActive ? null : (
                <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ handleClose }/>
                    <TwitterPicker color={ localColor } colors={labelColors} onChange={ handleChange } />
                </div>
             )}
        </div>
    ); 

}

const UpdateHabitModal: React.FC<UpdateHabitModalProps> = (props) => {

    const [form] = Form.useForm();
    const { state, dispatch } = useRootContext(); 
    const { user_id, habitTable, updateModalVisible, updateHabitId, habitMap, labelColors }: ReducerState = state; 

    const [localHabitName, setLocalHabitName] = React.useState<string>(updateHabitId as string); 
    const color: string = updateHabitId ? (habitMap.get(updateHabitId as string) as Habit).color : '#fff'; 

    // Populate form with values based on which of the 
    // habit cards was clicked 
    React.useEffect(() => {
        if (updateModalVisible) {
            setLocalHabitName(state.updateHabitId); 
        }
    }, [updateModalVisible]); 

    let close = () => dispatch(['set update modal hidden']); 
  
    let updateHabitRest = async (oldHabitId: string, newHabitId: string, newColor: string) => {
        let { success, habit } = await updateHabit(user_id, oldHabitId, newHabitId, newColor);
        if (success) {
            dispatch(['update habit', [oldHabitId, habit]]);
        } else {

        }
    }; 

    let onFinish = (values: any) => {
        let oldHabitId: string = updateHabitId as string; 
        let newHabitId: string = values.name; 
        let newHabitColor: string = values.color; 
        updateHabitRest(oldHabitId, newHabitId, newHabitColor); 
    }; 

    let onFinishFailed = (values: any) => {
        console.log("FAILURE", values); 
    }; 

    let validator = async (rule: any, value: any) => {
        return Promise.resolve(); 
        // if (!value) {
        //     return Promise.reject("empty name"); 
        // } else {
        //     value = (value as string).trim(); 
        //     if (value.length === 0) {
        //         return Promise.reject("empty name"); 
        //     } else if (habitTable.getNames().includes(value)) {
        //         return Promise.reject('duplicate name');
        //     } else {
        //         return Promise.resolve();    
        //     }
        // }                                                        
    };

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
            <Form 
            name="create-habit" 
            form={form} 
            onFinish={onFinish} 
            onFinishFailed={onFinishFailed}
            onValuesChange={(values) => console.log(values)}
            initialValues={{
                name: updateHabitId, 
                color: color 
            }}>
                <Box horizontal="center" vertical="middle" span={12}>
                    <div>
                        <Form.Item name="name" label="habit name" rules={[{ validator }]}>
                            <Input size="small" allowClear value={localHabitName} onChange={(e) => {
                                setLocalHabitName(e.target.value); 
                            }}/>
                        </Form.Item>
                        <Form.Item name="color" label="color">
                            <ColorSelectionControl/>
                        </Form.Item>
                    </div>
                </Box>
            </Form>
        </Modal>    
    ); 

}; 

export default UpdateHabitModal; 
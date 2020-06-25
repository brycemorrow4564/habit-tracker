import * as React from "react"; 
import _, { valuesIn } from "lodash"; 
import { Row, Col, Input, Button, Form, Modal } from "antd"; 
import { TwitterPicker } from "react-color"; 
import Box from "./Box"; 
import { colors } from "../utils/color";
import { ReducerState, Habit } from "../reducers/reducer";
import { useRootContext } from "../contexts/context"; 
import { updateHabitREST, deleteHabitREST } from "../rest/rest";

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

    let handleClick = () => {
        setSwatchActive(!swatchActive); 
    };

    let handleClose = () => {
        setSwatchActive(false); 
    };

    let handleChange = (color: any) => {
        if (onChange) {
            onChange(color.hex); 
        }
    };

    const styles: any = {
        color: {
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            background: value,
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
                    <TwitterPicker color={ value } colors={labelColors} onChange={ handleChange } />
                </div>
            )}
        </div>
    ); 

}

const UpdateHabitModal: React.FC<UpdateHabitModalProps> = (props) => {

    const [form] = Form.useForm();
    const { state, dispatch } = useRootContext(); 
    const { user_id, habitTable, updateModalVisible, updateHabit }: ReducerState = state; 
    const invalidNamesSet = updateHabit ? new Set(_.difference(habitTable.getNames(), [updateHabit.habit_id])) : []; 
    const initialColor: string = updateHabit ? updateHabit.color : ''; 
    const initialName: string = updateHabit ? updateHabit.habit_id : ''; 
    const initialValues: { [key: string]: any } = { name: initialName, color: initialColor }; 

    // Whenever the form is opened, reset form state to match the state of the clicked card 
    React.useEffect(() => {
        if (updateModalVisible && updateHabit) {
            console.log('updating form with', updateHabit); 
            form.setFieldsValue({ color: updateHabit.color }); 
            form.setFieldsValue({ name: updateHabit.habit_id }); 
        }
    }, [updateModalVisible, updateHabit]); 

    let deleteHabitRest = async (habitIdToDelete: string) => {
        let { success, habit } = await deleteHabitREST(user_id, habitIdToDelete); 
        if (success) {
            console.log("DELETE request to remove habit succeeded, ", habit); 
            dispatch(['delete habit', habitIdToDelete]); 
        } else {
            console.log("DELETE request to update habit FAILED"); 
        }
    }
  
    let updateHabitRest = async (oldHabitId: string, newHabitId: string, newColor: string) => {
        let { success, habit } = await updateHabitREST(user_id, oldHabitId, newHabitId, newColor);
        if (success) {
            console.log("POST request to update habit succeeded"); 
            dispatch(['update habit', [oldHabitId, habit]]);
        } else {
            console.log("POST request to update habit FAILED"); 
        }
    }; 

    let hide = () => {
        dispatch(['set update modal hidden']);  
    }; 

    let validator = async (rule: any, value: any) => {
        let s: string; 
        if (!_.isString(value)) {
            return Promise.reject("empty name"); 
        } else {
            s = (value as string).trim(); 
            if (s.length === 0) {
                return Promise.reject("empty name"); 
            } else if (s in invalidNamesSet) {
                return Promise.reject('duplicate name');
            } else {
                return Promise.resolve();    
            }
        }                                                     
    };

    let callbacks = {
        modal: {
            onOk: () => {
                form.submit();
            }, 
            onCancel: () => {
                hide();  
            }, 
            cancelButton: {
                onClick: () => {
                    hide(); 
                    if (updateHabit) {
                        deleteHabitRest(updateHabit.habit_id); 
                    }
                }
            }
        }, 
        form: {
            onValuesChange: (values: any) => {
                form.setFieldsValue(values); 
            }, 
            onFinish: (values: any) => {
                console.log("Form submission success", values); 
                if (updateHabit) {
                    updateHabitRest(updateHabit.habit_id, values.name, values.color);
                }
                hide(); 
            }, 
            onFinishFailed: (values: any) => {
                console.log("Form submission FAILED", values); 
                hide(); 
            }
        }, 
    }; 

    return (
        <Modal
        title="Update Habit"
        visible={updateModalVisible}
        onOk={callbacks.modal.onOk}
        onCancel={callbacks.modal.onCancel}>
            <Form 
            name="create-habit" 
            form={form} 
            initialValues={initialValues}
            onValuesChange={callbacks.form.onValuesChange}
            onFinish={callbacks.form.onFinish} 
            onFinishFailed={callbacks.form.onFinishFailed}>
                <Box horizontal="center" vertical="middle" span={12}>
                    <div>
                        {/* Button within modal window that deletes habit */}
                        <Button danger type={"primary"} onClick={callbacks.modal.cancelButton.onClick}>Delete Habit</Button>
                        {/* Form item that allows for changing of habit name */}
                        <Form.Item name="name" label="habit name" rules={[{ validator }]}>
                            <Input size="small" allowClear/>
                        </Form.Item>
                        {/* Form item that allows for chaning of habit color */}
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
import * as React from "react"; 
import _ from "lodash"; 
import { EditOutlined } from "@ant-design/icons";  
import { Row, Col } from "antd"; 
import * as d3color from "d3-color"; 
import Box from "./Box"; 
import { colors } from "../utils/color";
import { ReducerState, Habit } from "../reducers/reducer"; 
import { motion } from "framer-motion"; 
import { useRootContext } from "../contexts/context";

import "../css/HabitCard.css"; 

export interface HabitCardProps {
    habitName: string, 
    cardRefs: any
}

const getTextColor = (color: string) => {
    let rgbColor: d3color.RGBColor = d3color.rgb(color);
    let { r, g, b }: { r: number, g: number, b: number } = rgbColor; 
    return (r+g+b)/3 > 127.5 ? 'white' : 'black'; 
}

const HabitCard: React.FC<HabitCardProps> = (props) => {

    const { habitName, cardRefs } = props; 
    const { state, dispatch } = useRootContext(); 
    const { habitMap } : ReducerState = state; 
    const habit: Habit = habitMap.get(habitName) as Habit; 
    const { color, label } : { color: string, label: string } = habit;

    const updateHabit = () => {
        dispatch(['set update modal visible', habitName]); 
    }; 

    const variants = {
        active: {
            width: "14%", 
            background: color,
        },
        inactive: {
            width: "7%", 
            background: color
        }
    };

    const iconVariants = {
        active: {
            opacity: 1,
            transition: { delay: .05 }
        },
        inactive: {
            opacity: 0
        }
    };

    return (
        <Box key={habitName} colClassName="habit-card-container" span={24}>
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <motion.div 
                    style={{ height: '100%', position: 'relative', overflow: 'hidden', borderLeft: colors.timeaxis_border, borderTop: colors.timeaxis_border, borderBottom: colors.timeaxis_border }}
                    variants={variants}
                    initial="inactive"
                    whileHover="active">
                        <Box horizontal="space-around" vertical="middle" rowStyle={{ height: '100%' }}>
                            <motion.div
                            variants={iconVariants}
                            initial="inactive">
                                <EditOutlined style={{ color: getTextColor(color) }} translate={0} onClick={updateHabit}/>
                            </motion.div>
                        </Box>
                    </motion.div>
                </div>
                <div style={{ background: colors.grey[0], border: colors.timeaxis_border }}>
                    <div className="habit-card">
                        <p style={{ marginBottom: 0, fontSize: 16, fontWeight: 500 }}>{habitName}</p>
                        <div ref={ref => cardRefs.current[habitName] = ref}/>
                        {/* <Divider/> */}
                        <Row justify="space-between" align="middle">
                            <Col>
                                <p style={{ color: '#999999', marginBottom: 0 }}>daily</p>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </Box>
    );
}

export default HabitCard;

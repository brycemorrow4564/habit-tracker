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
    const [hovering, setHovering] = React.useState<boolean>(false); 
    const { state, dispatch } = useRootContext(); 
    const { habitMap } : ReducerState = state; 
    const habit: Habit = habitMap.get(habitName) as Habit; 

    const updateHabit = () => {
        dispatch(['set update modal visible', habitName]); 
    }; 

    const variants = {
        inactive: {
            width: "7.5%", 
            // borderRight: colors.habit_card_inner_border_inactive
        },
        active: {
            width: "15%", 
            // borderTopRightRadius: 6, 
            // borderBottomRightRadius: 6, 
            // borderRight: colors.habit_card_inner_border_active
        }
    };

    const iconVariants = {
        active: {
            opacity: 1,
            transition: { duration: .5 }
        },
        inactive: {
            opacity: 0, 
            transition: { duration: 0 }
        }
    };

    const animate = [hovering ? "active" : "inactive"]; 

    return (
        <Box key={habitName} rowStyle={colors.gridRowContainerPadding} span={24}>
            <motion.div 
            style={{ position: 'relative' }}
            onHoverStart={() => setHovering(true)}
            onHoverEnd={() => setHovering(false)}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <motion.div 
                    style={{ background: habit.color, height: '100%', position: 'relative', overflow: 'hidden', borderLeft: colors.timeaxis_border, borderTop: colors.timeaxis_border, borderBottom: colors.timeaxis_border }}
                    custom={habit.color}
                    variants={variants}
                    initial="inactive"
                    animate={animate}>
                        <Box horizontal="space-around" vertical="middle" rowStyle={{ height: '100%' }}>
                            <motion.div
                            variants={iconVariants}
                            initial="inactive"
                            animate={animate}>
                                <EditOutlined style={{ color: getTextColor(habit.color) }} translate={0} onClick={updateHabit}/>
                            </motion.div>
                        </Box>
                    </motion.div>
                </div>
                <div 
                ref={ref => cardRefs.current[habitName] = ref} 
                style={{ background: colors.grey[0], border: colors.timeaxis_border }}>
                    <div className="habit-card">
                        <p style={{ marginBottom: 0, fontSize: 16, fontWeight: 500 }}>{habitName}</p>
                        <div/>
                        {/* <Divider/> */}
                        <Row justify="space-between" align="middle">
                            <Col>
                                <p style={{ color: '#999999', marginBottom: 0 }}>daily</p>
                            </Col>
                        </Row>
                    </div>
                </div>
            </motion.div>
        </Box>
    );
}

export default HabitCard;

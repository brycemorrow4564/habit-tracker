import * as React from "react"; 
import _ from "lodash"; 
import { EditOutlined } from "@ant-design/icons";  
import { Row, Col } from "antd"; 
import styled from 'styled-components'; 
import Box from "./Box"; 
import { getTextColor } from "../utils/util"; 
import { colors } from "../utils/color";
import { ReducerState, Habit } from "../reducers/reducer"; 
import { motion } from "framer-motion"; 
import { useRootContext } from "../contexts/context";
import HabitCardContent from "./HabitCardContent"
   
export interface HabitCardProps {
    habitName: string, 
    cardRefs: any
};

const HabitCard: React.FC<HabitCardProps> = (props) => {

    const { habitName, cardRefs } = props; 
    const [hovering, setHovering] = React.useState<boolean>(false); 
    const { state, dispatch } = useRootContext(); 
    const { habitMap } : ReducerState = state; 
    const habit: Habit = habitMap.get(habitName) as Habit; 

    const variants = {
        inactive: {
            width: "8%", 
        },
        active: {
            width: "15%", 
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

    const callbacks = {
        container: {
            onHoverStart: () => setHovering(true), 
            onHoverEnd: () => setHovering(false)
        },
        icon: {
            onClick: () => dispatch(['set update modal visible', habitName])
        } 
    }

    return (
        <Box key={habitName} rowStyle={colors.gridRowContainerPadding} span={24}>
            <motion.div 
            style={{ position: 'relative' }}
            onHoverStart={callbacks.container.onHoverStart}
            onHoverEnd={callbacks.container.onHoverEnd}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <motion.div 
                    style={{ background: habit.color, height: '100%', position: 'relative', overflow: 'hidden', borderLeft: colors.timeaxis_border, borderTop: colors.timeaxis_border, borderBottom: colors.timeaxis_border }}
                    custom={habit.color}
                    variants={variants}
                    initial="inactive"
                    animate={animate}>
                        <Box 
                        horizontal="space-around" 
                        vertical="middle" 
                        rowStyle={{ height: '100%' }}>
                            <motion.div
                            variants={iconVariants}
                            initial="inactive"
                            animate={animate}>
                                <EditOutlined 
                                style={{ color: getTextColor(habit.color) }} 
                                translate={0} 
                                onClick={callbacks.icon.onClick}/>
                            </motion.div>
                        </Box>
                    </motion.div>
                </div>
                <div 
                ref={ref => cardRefs.current[habitName] = ref} 
                style={{ background: '#333', border: colors.timeaxis_border }}>
                    <HabitCardContent 
                    habitName={habit.habit_id} 
                    habitFrequency={habit.frequency}/>
                </div>
            </motion.div>
        </Box>
    );
};

export default HabitCard;



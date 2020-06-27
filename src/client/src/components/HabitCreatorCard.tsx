import * as React from "react"; 
import _ from "lodash"; 
import { PlusCircleOutlined, CheckOutlined } from "@ant-design/icons";  
import { Row, Col, Input, Button, Form } from "antd"; 
import { motion } from "framer-motion"; 
import useDimensions from "react-use-dimensions"; 
import Box from "./Box"; 
import { colors } from "../utils/color";
import { ReducerState } from "../reducers/reducer";
import { useRootContext } from "../contexts/context"; 

export interface HabitCreatorCardProps {

}

const HabitCreatorCard: React.FC<HabitCreatorCardProps> = (props) => {

  const { state, dispatch } = useRootContext(); 
  const { init }: ReducerState = state; 
  const [transitionType, setTransitionType] = React.useState<any>({ positionTransition: true }); 
  const [hovering, setHovering] = React.useState<boolean>(false); 
  const [iconRef, { width: iconWidth, height: iconHeight }] = useDimensions(); 
  const [textRef, { width: textWidth, height: textHeight }] = useDimensions();

  // Ensures that we only enable layoutTransitions after all habit cards have 
  // been initially loaded into the table 
  React.useEffect(() => {
    if (init) {
      setTransitionType({ layoutTransition: { type: 'spring', damping: 300 } }); 
    }
  }, [init]); 

  const wrapContent = (content: any) => (
    <Box span={24}>
      <div style={{ background: colors.timeaxis_background }}>
          <motion.div 
          style={Object.assign({ position: 'relative', height: 45, overflow: 'hidden' }, colors.gridRowContainerPadding)}
          onHoverStart={() => setHovering(true)} 
          onHoverEnd={() => setHovering(false)}
          onClick={() => dispatch(['set create modal visible'])}>
            {content}
          </motion.div>
      </div>
    </Box>
  ); 

  const shiftPercent = 16; 

  const iconMarginLeft = iconWidth ? -(iconWidth / 2) : 0; 
  const iconMarginTop = iconHeight ? -(iconHeight / 2) : 0; 
  const textMarginLeft = iconMarginLeft / 2; 
  const textMarginTop = textHeight ? -(textHeight / 2) : 0; 

  const styles: { [key: string]: React.CSSProperties } = {
    icon: {
      position: 'absolute', 
      left: hovering ? `${50-shiftPercent}%` : '50%', 
      marginLeft: iconMarginLeft, 
      top: '50%', 
      marginTop: iconMarginTop, 
      zIndex: 3
    }, 
    text: {
      position: 'absolute', 
      left: hovering ? `${46}%` : '40%', 
      marginLeft: textMarginLeft, 
      top: '50%', 
      marginTop: textMarginTop, 
      zIndex: 1
    }, 
    cover: {
      position: 'absolute', 
      left: hovering ? `${-shiftPercent}%` : 0, 
      marginLeft: -iconMarginLeft*1.25, 
      width: '50%', 
      height: '100%', 
      background: colors.timeaxis_background, 
      zIndex: 2
    }
  }; 

  return wrapContent(

      <React.Fragment>

          <motion.div
          { ...transitionType }
          ref={textRef}
          initial={false}
          style={styles.text}
          animate={{ 
            opacity: hovering ? 1 : 0 
          }}>
            <span style={{ display: 'inline-block', color: 'white' }}>New Habit</span>
          </motion.div>

          <motion.div 
          { ...transitionType }
          style={styles.cover}/>

          <motion.div 
          { ...transitionType }
          ref={iconRef}
          style={styles.icon}>
              <PlusCircleOutlined 
              style={{ color: colors.habitlist_title_color, display: 'inline-block', float: 'left' }}
              translate={0} />            
          </motion.div>

      </React.Fragment>

  );

}

export default HabitCreatorCard;

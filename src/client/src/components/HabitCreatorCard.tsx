import * as React from "react"; 
import _ from "lodash"; 
import { PlusCircleOutlined, CheckOutlined } from "@ant-design/icons";  
import { Row, Col, Input, Button, Form } from "antd"; 
import { motion } from "framer-motion"; 
import Box from "./Box"; 
import { colors } from "../utils/color";
import { ReducerState } from "../reducers/reducer";
import { useRootContext } from "../contexts/context"; 
import CreateHabitModal from "./CreateHabitModal"; 

export interface HabitCreatorCardProps {

}

const HabitCreatorCard: React.FC<HabitCreatorCardProps> = (props) => {


  const { dispatch } = useRootContext(); 
  const [hovering, setHovering] = React.useState<boolean>(false); 

  const wrapContent = (content: any) => (
    <Box span={24}>
      <div style={{ background: colors.grey[2] }}>
          <motion.div 
          className="habit-card"
          onHoverStart={() => setHovering(true)} 
          onHoverEnd={() => setHovering(false)}
          onClick={() => dispatch(['set create modal visible'])}>
            {content}
          </motion.div>
      </div>
    </Box>
  ); 

  return wrapContent(

      <motion.div positionTransition style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: !hovering ? "space-around" : "center", alignItems: "center" }}>

          <motion.div 
          positionTransition
          style={{ flexBasis: 'auto', marginRight: 10 }}>
            <PlusCircleOutlined 
            style={{ color: colors.habitlist_title_color }}
            translate={0} />
          </motion.div>

          <motion.div
          positionTransition
          style={{ pointerEvents: 'none' }}
          animate={{ 
            opacity: hovering ? 1 : 0,
            display: hovering ? 'block' : 'none'
          }}>
            <span style={{ pointerEvents: 'none' }}>New Habit</span>
          </motion.div>

      </motion.div>


      /* 
      <Col span={12} style={{ height: 30 }}>
        <Box horizontal="end" vertical="middle">
          
        </Box>
      </Col> 
      
      <Col span={12} style={{ height: 30 }}>

          
      </Col> 
    */

  );

}

export default HabitCreatorCard;

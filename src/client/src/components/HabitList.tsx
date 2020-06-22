import * as React from "react"; 
import { PlusCircleOutlined, EditOutlined } from "@ant-design/icons";  
import { scaleLinear } from "d3-scale";
import useDimensions from "react-use-dimensions"; 
import _ from "lodash"; 
import { Row, Col } from "antd"; 
import Box from "./Box"; 
import { colors } from "../utils/color";
import { ReducerState } from "../reducers/reducer";
import { useRootContext } from "../contexts/context"; 
import HabitCard from "./HabitCard"; 
import HabitCreatorCard from "./HabitCreatorCard"; 

import "../css/HabitList.css"; 

/*
The time axis for the habit table viewer 
*/

export interface HabitListProps {

}

const HabitList: React.FC<HabitListProps> = (props) => {

  // const [addingNewHabit, setAddingNewHabit] = React.useState(false); 
  const listRef = React.useRef<any>(null); 
  const itemRefs = React.useRef<{ [key: string]: any }>({}); 
  const [listHeight, setListHeight] = React.useState<number>(0); 
  const { state, dispatch } = useRootContext(); 
  const { 
    habitTable, 
    user_id
  }: ReducerState = state; 

  React.useEffect(() => {
    if (listRef && listRef.current) {
      // @ts-ignore
      setListHeight(listRef.current.offsetHeight); 
    }
  }, [listRef]); 

  React.useEffect(() => {
    if (itemRefs && itemRefs.current) {
      let yAnchors = []; 
      for (let habit of Object.keys(itemRefs.current)) {
        let el: HTMLElement = itemRefs.current[habit];
        let { offsetTop } = el; 
        yAnchors.push(offsetTop); 
      }
      dispatch(['update dy', yAnchors[yAnchors.length-1] - yAnchors[0]]); 
    }
  }, [itemRefs]); 

  // TODO: logic of this effect needs to occur on resize as well
  React.useEffect(() => {
    if (listRef && listRef.current) {
      // get references to DOM nodes via refs and a className selector 
      let listEl: HTMLElement = listRef.current; 
      let listElems: HTMLCollectionOf<Element> = listEl.getElementsByClassName('habit-card');
      
      // get the height of each list element 
      let heights = []; 
      for (let elem of listElems) {
        heights.push(elem.getBoundingClientRect().height);  
      }
      // get the list item margin bottom (global to all list elements)
      let elStyle = window.getComputedStyle(listElems[0] as HTMLElement);
      let marginBottomStr = elStyle.getPropertyValue('margin-bottom'); // ASSUMING UNITS ARE IN PIXELS. THIS IS BRITTLE 
      let marginBottom = parseInt(marginBottomStr.slice(0, marginBottomStr.length-2)); // remove 'px' suffix, cast to number

      
      dispatch(['update list item dimensions', [heights, marginBottom]]);
    }
  }, [listRef, habitTable]); 

  const habitCardFromName = (habitName: string) => <HabitCard habitName={habitName} cardRefs={itemRefs} />; 

  const colStyle = { borderLeft: colors.timeaxis_border, borderRight: colors.timeaxis_border, borderBottom: colors.timeaxis_border, background: colors.timeaxis_background, height: '100%' }; 

  return (
    <Box span={colors.left_span} horizontal="end" vertical="middle" rowStyle={{ height: '100%' }} colStyle={colStyle}>
        <div className="habit-list-wrapper" ref={listRef}>

        {/* List items for each habit */}
        {habitTable.getNames().map(habitCardFromName)}

        {/* Small form for adding new habits */}
        <HabitCreatorCard/>

        </div>
    </Box>
    // <Row justify="end" align="middle" style={{ height: '100%' }}>
    //   <Col span={12} style=>
        
    //   </Col>
    // </Row>
  );
}

export default HabitList;

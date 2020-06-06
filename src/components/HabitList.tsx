import * as React from "react"; 
import { PlusCircleOutlined } from "@ant-design/icons";  
import { scaleLinear } from "d3-scale";
import useDimensions from "react-use-dimensions"; 
import _ from "lodash"; 
import moment from "moment"; 
import { Row, Col, List } from "antd"; 
import { colors } from "../utils/color";
import { useRootContext } from "../contexts/context"; 

/*
The time axis for the habit table viewer 
*/

export interface HabitListProps {

}

const HabitList: React.FC<HabitListProps> = (props) => {

  const listRef = React.useRef<any>(null); 
  const itemRefs = React.useRef<{ [key: string]: any }>({}); 
  const [listHeight, setListHeight] = React.useState<number>(0); 
  const { state, dispatch } = useRootContext(); 
  const { habitTable, dy } = state; 

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
  }, [listRef]); 

  return (
      <React.Fragment>
          <Row justify="end" align="middle" style={{ height: '100%' }}>
            <Col span={12} style={{ background: colors.primary.dark, height: '100%' }}>
              <div ref={listRef}>
                <List
                className="habit-card-list"
                footer={
                  <Row justify="space-around" align="middle">
                    <Col>
                      <PlusCircleOutlined 
                      style={{ color: colors.primary.light }}
                      translate={0} 
                      onClick={() => false}/>
                      <p style={{ display: 'inline-block', color: colors.primary.light, marginLeft: '.3em' }}>New Habit</p>
                    </Col>
                  </Row>
                }
                dataSource={habitTable ? habitTable.getNames() : []}
                renderItem={(item) => <List.Item 
                                      className="habit-card"
                                      style={{ 
                                        background: colors.background, 
                                        marginBottom: 2 
                                      }}
                                      extra={
                                        <div ref={ref => {
                                          // @ts-ignore
                                          itemRefs.current[item] = ref;
                                        }}/>
                                      }>{`${item}`}</List.Item>
                }/>
              </div>
            </Col>
          </Row>
      </React.Fragment>
  );
}

export default HabitList;

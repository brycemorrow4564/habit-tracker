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

  const itemRefs = React.useRef<{ [key: string]: any }>({}); 
  const { state, dispatch } = useRootContext(); 
  const { habitTable } = state; 

  React.useEffect(() => {
    if (itemRefs && itemRefs.current) {
      let yAnchors = []; 
      for (let habit of Object.keys(itemRefs.current)) {
        let el: HTMLElement = itemRefs.current[habit];
        let { offsetTop } = el; 
        yAnchors.push(offsetTop); 
      }
      dispatch(['update y anchors', yAnchors]); 
    }
  }, [itemRefs]); 

  return (
      <React.Fragment>
          <Row justify="end" align="middle" style={{ height: '100%' }}>
            <Col span={12} style={{ background: colors.primary.dark, height: '100%' }}>
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
                                        return itemRefs.current[item] = ref;
                                      }}/>
                                    }>{`${item}`}</List.Item>
              }/>
            </Col>
          </Row>
      </React.Fragment>
  );
}

export default HabitList;

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

  const { state, dispatch } = useRootContext(); 
  const { habitTable } = state; 

  return (
      <React.Fragment>
          <Row justify="end" align="middle" style={{ height: '100%' }}>
            <Col span={12} style={{ background: colors.primary.dark, height: '100%' }}>
              <List
              style={{ margin: 8 }}
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
              renderItem={item => <List.Item style={{ background: colors.background, marginBottom: 2 }}>{`${item}`}</List.Item>}
              />
            </Col>
          </Row>
      </React.Fragment>
  );
}

export default HabitList;

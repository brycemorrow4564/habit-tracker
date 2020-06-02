import * as React from 'react';
import * as ReactDOM from "react-dom"; 
import { LeftOutlined, RightOutlined } from "@ant-design/icons";  
import _ from "lodash"; 
import moment from "moment"; 
import { Row, Col, Carousel } from "antd"; 
import { cssLinearGradientPropertyGenerator, weekIndexMapper } from "../utils/util"; 
import { useRootContext } from "../contexts/context"; 

import SingleWeekHabitRow from '../components/SingleWeekHabitRow';
import GridTimeAxis from "../components/GridTimeAxis"; 

export interface SingleWeekViewProps {

}

const SingleWeekView: React.FC<SingleWeekViewProps> = (props) => {

  const { state } = useRootContext(); 
  const { habitTable, windowStartIndex, windowStartDate, windowEndDate, windowEndIndex } = state; 

  const getCurrentDateText = () => {
    /*  the current date window either exists within one 
        month or spans 2 months. format based on this distinction
    */
    let monthStart = windowStartDate.month(); 
    let monthEnd = windowEndDate.month(); 
    if (monthStart === monthEnd) {
      // Display month once at start of string 
      return `${windowStartDate.format('MMM D')} - ${windowEndDate.format('D')}`; 
    } else {
      // Display month on both sides of the '-' 
      return `${windowStartDate.format('MMM D')} - ${windowEndDate.format('MMM D')}`; 
    }
  }; 

  return (
      <React.Fragment>

        {/* Header */}
        {/* <Row justify="center" align="middle">
          <Col span={8}>
            <h1 className="header-text">Habit Tracker</h1>
          </Col> 
        </Row> */}

        {/* Text describing time granularity of current view */}
        {/* <Row justify="center" align="middle">
          <Col span={8}>
            <h4 className="header-text-sub" style={{ fontSize: 22 }}>{getSubtitle()}</h4>
          </Col> 
        </Row> */}

        {/* Text describing current time window of analysis */}
        <Row justify="center" align="middle">
          <Col span={8}>
            <h4 className="header-text-sub" style={{ fontSize: 22 }}>{getCurrentDateText()}</h4>
          </Col> 
        </Row>
        
        <GridTimeAxis/>

        {/* Data Rows */}
        {/* {habitTable.map((data: number[], i: number) => (<SingleWeekHabitRow data={data.slice(windowStartIndex, windowEndIndex+1)} index={i} />))} */}
        
      </React.Fragment>
  );
}

export default SingleWeekView;

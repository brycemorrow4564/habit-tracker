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
import GridRowLayout from "../components/GridRowLayout"; 

export interface SingleWeekViewProps {

}

const SingleWeekView: React.FC<SingleWeekViewProps> = (props) => {

  const { state } = useRootContext(); 
  const { habitTable } = state; 
  const names = habitTable.getNames(); 

  return (
      <React.Fragment>

        <GridTimeAxis/>

        <GridRowLayout
        left={null}
        center={null}
        right={null}/>

        {/* Data Rows */}
        {/* {habitTable.map((data: number[], i: number) => (<SingleWeekHabitRow data={data.slice(windowStartIndex, windowEndIndex+1)} index={i} />))} */}
        
      </React.Fragment>
  );
}

export default SingleWeekView;

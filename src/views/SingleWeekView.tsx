import * as React from 'react';
import * as ReactDOM from "react-dom"; 
import _ from "lodash"; 
import { useRootContext } from "../contexts/context"; 

import SingleWeekHabitRow from '../components/SingleWeekHabitRow';
import GridTimeAxis from "../components/GridTimeAxis"; 
import GridRowLayout from "../components/GridRowLayout";
import HabitList from "../components/HabitList";  

export interface SingleWeekViewProps {

}

const SingleWeekView: React.FC<SingleWeekViewProps> = (props) => {

  return (
      <React.Fragment>

        <GridTimeAxis/>

        <GridRowLayout
        left={<HabitList/>}
        center={null}
        right={null}/>

        {/* Data Rows */}
        {/* {habitTable.map((data: number[], i: number) => (<SingleWeekHabitRow data={data.slice(windowStartIndex, windowEndIndex+1)} index={i} />))} */}
        
      </React.Fragment>
  );
}

export default SingleWeekView;

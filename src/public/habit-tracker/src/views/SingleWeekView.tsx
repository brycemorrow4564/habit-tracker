import * as React from 'react';
import _ from "lodash"; 
import { useRootContext } from "../contexts/context"; 
import moment from "moment"; 
import SingleWeekHabitRow from '../components/SingleWeekHabitRow';
import GridTimeAxis from "../components/GridTimeAxis"; 
import GridRowLayout from "../components/GridRowLayout";
import HabitList from "../components/HabitList";  
import { colors } from "../utils/color";  

import "../css/SingleWeekView.css"; 

export interface SingleWeekViewProps {

}

const SingleWeekView: React.FC<SingleWeekViewProps> = (props) => {

  const { state, dispatch } = useRootContext(); 
  const { habitTable } = state; 

  const today = moment(); 

  return (
      <div>

          <div style={{ background: colors.body_background }}> 

          <GridTimeAxis/>

          <GridRowLayout
          left={<HabitList/>}
          center={
            <div className="habit-table-viz-grid">
              <div>
                {habitTable.getNames().map((habitName: string, i: number) => (<SingleWeekHabitRow 
                                                                              key={habitName}
                                                                              habitName={habitName} 
                                                                              rowIndex={i}/>))}
              </div>
            </div>
          }
          right={null}/>

          </div>
        
      </div>
  );
}

export default SingleWeekView;

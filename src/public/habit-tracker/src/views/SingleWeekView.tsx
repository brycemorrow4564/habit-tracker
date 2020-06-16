import * as React from 'react';
import _ from "lodash"; 
import { useRootContext } from "../contexts/context"; 
import moment from "moment"; 
import SingleWeekHabitRow from '../components/SingleWeekHabitRow';
import GridTimeAxis from "../components/GridTimeAxis"; 
import GridRowLayout from "../components/GridRowLayout";
import HabitList from "../components/HabitList";  
import { colors } from "../utils/color";  

export interface SingleWeekViewProps {

}

const SingleWeekView: React.FC<SingleWeekViewProps> = (props) => {

  const { state, dispatch } = useRootContext(); 
  const { habitTable } = state; 

  const today = moment(); 

  return (
      <React.Fragment>

          <div style={{ background: colors.primary.dark }}> 

          <GridTimeAxis/>

          <GridRowLayout
          left={<HabitList/>}
          center={
            <div className="habit-table-viz-grid" style={{ background: colors.primary.dark }}>
              <div style={{ background: colors.primary.dark, paddingRight: '.5em' }}>
                {habitTable.getNames().map((habitName: string, i: number) => (<SingleWeekHabitRow 
                                                                              key={habitName}
                                                                              habitName={habitName} 
                                                                              rowIndex={i}/>))}
              </div>
            </div>
          }
          right={null}/>

          </div>
        
      </React.Fragment>
  );
}

export default SingleWeekView;

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

        <GridTimeAxis/>

        <GridRowLayout
        left={<HabitList/>}
        center={
          <div className="habit-table-viz-grid" style={{ background: colors.primary.dark }}>
            <div style={{ background: colors.background }}>
              {habitTable.getNames().map((habitName: string) => (<SingleWeekHabitRow habitName={habitName}/>))}
            </div>
          </div>
        }
        right={null}/>

        
        
      </React.Fragment>
  );
}

export default SingleWeekView;

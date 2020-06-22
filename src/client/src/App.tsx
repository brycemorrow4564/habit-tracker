import * as React from 'react';
import { StateProvider, DispatchProvider } from './contexts/context'; 
import { reducer, reducerInitialState, ReducerState } from './reducers/reducer'; 
import SingleWeekView from "./views/SingleWeekView"; 
import { getHabits, updateHabitObservations } from "./rest/rest"; 
// import mountainImage from "./assets/mountain.jpg"; 
import { colors } from "./utils/color"; 

import './css/Custom.css'; 
import './scss/Custom.scss';

function App() {

  /*
  Views 
    * One week at a time        (win the day)
      - linear: each habit is a single row and we show values for a window of time 
    * Multiple weeks at a time  (hey habit)
      - each: habit is a grid and the grid period represents the periodicity of the habit to view 
    * Calendar view (monthly)   (similar to hey habit but better)
  */

  const [ state, dispatch ]: [ReducerState, any] = React.useReducer(reducer, reducerInitialState);

  React.useEffect(() => {
    getHabits(state.user_id).then(({ habits }) => dispatch(['create habits', habits]));
  }, []); 

  React.useEffect(() => {
    if (state.habitTableChanges.count) {
      let { habit_id, timestamp, value } = state.habitTableChanges; 
      timestamp = new Date(timestamp.toDateString()); 
      updateHabitObservations(state.user_id, habit_id, timestamp, value).then((v) => {
        console.log(v); 
      })
    }
  }, [state.habitTableChanges])

  React.useEffect(() => {
    let coll: HTMLCollectionOf<HTMLBodyElement> = document.getElementsByTagName("body"); 
    if (!coll.length) {
      throw Error("unable to find body element"); 
    } else {
      let body: HTMLBodyElement = coll[0]; 
      body.style.background = colors.body_background; 
    }
  }, []); 

  return (
    <StateProvider value={state}>
      <DispatchProvider value={dispatch}>
        <div style={{ width: '100%', height: '100%' }}>
          <div style={{ marginTop: '3em' }}>
            <SingleWeekView/>
          </div>
        </div>
      </DispatchProvider>
    </StateProvider>   
  );
}

export default App;

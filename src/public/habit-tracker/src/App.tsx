import * as React from 'react';
import { StateProvider, DispatchProvider } from './contexts/context'; 
import { reducer, reducerInitialState } from './reducers/reducer'; 
import SingleWeekView from "./views/SingleWeekView"; 
import { getHabits } from "./rest/rest"; 
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

  const [ state, dispatch ] = React.useReducer(reducer, reducerInitialState);

  React.useEffect(() => {
    async function callExpress() {
      try {
        let { habits } = await getHabits(state.user_id); 
        dispatch(['create habits', habits]); 
      } catch (err) {
        alert(err);
      }
    }
    callExpress(); 
  }, []); 

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

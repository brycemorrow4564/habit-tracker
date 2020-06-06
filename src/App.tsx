import * as React from 'react';
import { RootProvider } from './contexts/context'; 
import { reducer, reducerInitialState } from './reducers/reducer'; 
import SingleWeekView from "./views/SingleWeekView"; 
import mountainImage from "./assets/mountain.jpg"; 

import './css/App.css';
import './css/StreakGlyph.css'; 
import './css/WeekAxis.css'; 
import './css/Custom.css'; 
import './css/Custom.scss';

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
  const [backgroundInit, setBackgroundInit] = React.useState<Boolean>(true); 

  // set background property of html element with an image
  // React.useEffect(() => {
  //   let elem = document.querySelector('html') as HTMLElement; 
  //   elem.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${mountainImage})`; 
  //   setBackgroundInit(true); 
  // }, []); 

  return (
    <RootProvider value={{ state, dispatch }}>
      {backgroundInit ? <div style={{ width: '100%', height: '100%' }}><SingleWeekView/></div> : null}
    </RootProvider>    
  );
}

export default App;

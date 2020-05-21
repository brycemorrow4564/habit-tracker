import * as React from 'react';
import { RootProvider } from './context'; 
import { reducer, reducerInitialState } from './reducer'; 

import SingleWeekView from "./views/SingleWeekView"; 

import './App.css';
import './Custom.css'; 
import './Custom.scss';

/*
Views 
  * One week at a time        (win the day)
    - linear: each habit is a single row and we show values for a window of time 
  * Multiple weeks at a time  (hey habit)
    - each: habit is a grid and the grid period represents the periodicity of the habit to view 
  * Calendar view (monthly)   (similar to hey habit but better)
*/

function App() {

  const [ state, dispatch ] = React.useReducer(reducer, reducerInitialState);

  return (
    <RootProvider value={{ state, dispatch }}>
      <SingleWeekView/>
    </RootProvider>    
  );
}

export default App;

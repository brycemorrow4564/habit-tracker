import * as React from 'react';
import _ from "lodash"; 
import { ThemeProvider } from "styled-components"; 
import { generate, presetPrimaryColors } from '@ant-design/colors';
import { schemeGreys } from "d3-scale-chromatic"; 
import { Theme } from "./theme"; 
import { StateProvider, DispatchProvider } from './contexts/context'; 
import { reducer, reducerInitialState, ReducerState } from './reducers/reducer'; 
import SingleWeekView from "./views/SingleWeekView"; 
import { getHabits, updateHabitObservations } from "./rest/rest"; 

import './css/Custom.css'; 
import './scss/Custom.scss';

// All of the sequential color palettes (generated with primary colors)
// we have to use for styling purposes within our application 
const colors = Object.entries(presetPrimaryColors).reduce((acc: any, [palette_name, color]: [string, string]) => {
  if (palette_name === 'grey') {
      // TODO: something is wrong with the antd color grey color palette so 
      //       we use a d3 palette instead. 
      acc[palette_name] = schemeGreys[9]; 
      acc[palette_name].primary = acc[palette_name][4]; 
  } else {
      acc[palette_name] = generate(color, { theme: 'dark', backgroundColor: '#141414' });
  }
  return acc; 
}, {});

const { blue, grey } = colors; 

const theme: Theme = {

  body_background: blue[1],            
  table_axes_border: `1px solid ${grey[2]}`,          
  table_axes_background: '#556676',      
  habitlist_card_background: grey[2],  
  habitlist_card_border: grey[5],      
  timeaxis_card_background: grey[2], 
  timeaxis_card_current_background: '#46ab16', 
  timeaxis_card_border: `1px solid ${grey[5]}`,
  shift_button_color: grey[1], 

  'timeaxis_text_normal_low_contrast': grey[5], 
  'timeaxis_text_normal_high_contrast': grey[7], 
  'timeaxis_text_current_low_contrast': grey[2], 
  'timeaxis_text_current_high_contrast': grey[0], 
  'habitlist_title_color': grey[0], 
  'habitlist_header_border_bottom': '0', 
  'left_span': 14, 
  'right_span': 14, 
  'axisRowPadding': {
      paddingLeft: '1em',
      paddingRight: '1em',
      paddingTop: '.5em' 
  },
  'gridRowContainerPadding': {
      paddingLeft: '1em',
      paddingRight: '1em'
  }, 
  'glyph_background_color': "#f8f8f8", 
  'habit_card_inner_border_inactive': `1px solid ${grey[2]}`, 
  'habit_card_inner_border_active': `1px solid ${grey[4]}`
  
};

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
      }); 
    }
  }, [state.habitTableChanges])

  React.useEffect(() => {
    let coll: HTMLCollectionOf<HTMLBodyElement> = document.getElementsByTagName("body"); 
    if (!coll.length) {
      throw Error("unable to find body element"); 
    } else {
      let body: HTMLBodyElement = coll[0]; 
      body.style.background = theme.body_background; 
    }
  }, []); 

  return (
    <StateProvider value={state}>
      <DispatchProvider value={dispatch}>
        <ThemeProvider theme={theme}>
          <div style={{ width: '100%', height: '100%' }}>
            <div style={{ marginTop: '3em' }}>
              <SingleWeekView/>
            </div>
          </div>
        </ThemeProvider>
      </DispatchProvider>
    </StateProvider>   
  );
}

export default App;

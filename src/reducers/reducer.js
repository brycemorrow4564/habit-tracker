import _ from "lodash";
import moment from "moment"; 
import { 
    HabitData, 
    HabitTable, 
    computeWeekAlignedWindowAroundDate, 
    shiftWindowDays, 
    Week, 
    WeeksWindower
} from "../utils/time"; 

let numHabits = 10; 
let habitHistoryLength = 34; 

let dummyData = () => {

    let today = moment(); 
    let startDate = today.subtract(habitHistoryLength - 1, 'days'); 

    const table = new HabitTable(); 
    for (let i of _.range(0, numHabits)) {
        let data = new HabitData(); 
        let curr = startDate.clone(); 
        for (let j of _.range(0, habitHistoryLength)) {
            if (Math.random() < .5) {
                data.set(curr, 1); 
            }
            curr.day(1); 
        }
        table.add(`Habit-${i}`, data); 
    }

    return table; 
}; 

const numWeeks  = 1; 
const windowSize = numWeeks * 7; 
const table = dummyData(); 
const week = new Week(1); // a week that starts on monday 
const weeksWindower = new WeeksWindower(table.getMaxDate(), numWeeks, week); 
const dateMin = table.getMinDate(); 
const dateMax = table.getMaxDate(); 

export const reducerInitialState = {

    // TODO:    get rid of singleWeekViewXAnchors and calculate 
    //          this value some other way. It's brittle to have this
    //          rely upon the DOM 

    // TODO:    the cellHeight and cellWidth should start as null 
    //          values and be assigned based on a hook 

    "cellWidth": 40,                                // the width of grid cells for habit tracking
    "cellHeight": 40,                               // the height of grid cells for habit tracking
    "windowSize": windowSize,                       // the temporal width (in days) of current time period (summarized in view) 
    "singleWeekViewOffset": 6,                      // the span property value used to define the spacing for the view grid 
    "singleWeekXAnchors": null,                     // the x positions (within the grid coord system) of the 
                                                    // labels (day/month/day-of-week) on the time axis. this 
                                                    // information is used to align the cols of the habit table. 
    "numHabits": numHabits,                         // number of rows in the habit table 
    "habitTable": table,                            // an instance of HabitTable 
    "dateMin": dateMin,                             // the earliest date for which we have a habit observation (depends on user)
    "dateMax": dateMax,                             // the latest date for which we have a habit observation (depends on user)
    "windowStartDate": weeksWindower.start,         // the first day (sunday) in the current selected week (changes with user interaction)
    "windowEndDate": weeksWindower.end,             // the last day (saturday) in the current selected week (changes with user interaction)

}; 

export function reducer(state, [type, payload]) {

    const mutators = { 
        'set date range': () => {
            let [dateMin, dateMax] = payload; 
            const windowCount = Math.ceil(dateMax.diff(dateMin, 'weeks', true));
            return { ...state, dateMin, dateMax, windowCount }; 
        }, 

        'set windowSize': () => {
            return { ...state, windowSize: payload };  
        }, 
        'set singleWeekXAnchors': () => {
            return { ...state, singleWeekXAnchors: payload }; 
        }, 
        'set dataRowCol': () => {
            let habitTable = _.cloneDeep(state.habitTable); 
            let [r,c,v] = payload; 
            habitTable[r][c] = v;
            return { ...state, habitTable }; 
        }, 
        'shift week backwards': () => {
            if (state.windowEndIndex + 7 >= habitHistoryLength) {
                // cannot shift the window backwards so we abort the shift request 
                return { ...state }; 
            } else {
                // can shift the window backwards. shift both indices and 
                let { windowStartDate, windowEndDate } = shiftWindowDays(state.windowStartDate, state.windowEndDate, -7); 
                return { ...state, windowStartDate, windowEndDate };
            }
        },
        'shift week forwards': () => {
            if (state.windowStartIndex - 7 < 0) {
                // cannot shift the window forwards so we abort the shift request 
                return { ...state }; 
            } else {
                // can shift the window forwards
                let { windowStartDate, windowEndDate } = shiftWindowDays(state.windowStartDate, state.windowEndDate, 7); 
                return { ...state, windowStartDate, windowEndDate };
            }
        }
    }; 

    if (mutators[type] === undefined) {
        console.log("UNDEFINED MUTATOR KEY: ", type); 
        debugger; 
    }

    return mutators[type](); 

}
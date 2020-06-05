import _ from "lodash";
import moment from "moment"; 
import { 
    HabitHistory, 
    HabitTable, 
    Week, 
    WeeksWindower
} from "../utils/time"; 

let numHabits = 10; 
let habitHistoryLength = 34; 

let dummyHabitTable = () => {

    let today = moment(); 
    let startDate = today.subtract(habitHistoryLength - 1, 'days'); 

    const table = new HabitTable(); 
    for (let i of _.range(0, numHabits)) {
        let data = new HabitHistory(); 
        let curr = startDate.clone(); 
        for (let j of _.range(0, habitHistoryLength)) {
            if (Math.random() < .5) {
                data.set(curr.clone(), 1); 
            }
            curr.add(1, 'day'); 
        }
        table.add(`habit-${i}`, data); 
    }

    return table; 
}; 

const numWeeks  = 2; 
const windowSize = numWeeks * 7; 
const table = dummyHabitTable(); 
const week = new Week(2); // a week that starts on monday 
const weeksWindower = new WeeksWindower(table.getMaxDate(), numWeeks, week); 

export const reducerInitialState = {

    // TODO:    the cellHeight and cellWidth should start as null 
    //          values and be assigned based on a hook 
    "singleWeekViewOffset": 4, 
    "cellWidth": null,                              // the width of grid cells for habit tracking
    "cellHeight": null,                             // the height of grid cells for habit tracking
    "windowSize": windowSize,                       // the temporal width (in days) of current time period (summarized in view) 
    "habitTable": _.cloneDeep(table),               // an instance of HabitTable 
    "weeksWindower": _.cloneDeep(weeksWindower),    // an instance of WeeksWindower 

}; 

export function reducer(state, [type, payload]) {

    const mutators = { 
        'shift window': () => {
            let forwards = payload; 
            let weeksWindower = _.cloneDeep(state.weeksWindower); 
            if (forwards) {
                weeksWindower.shiftForwards(); 
            } else {
                weeksWindower.shiftBackwards(); 
            }
            return { ...state, weeksWindower }; 
        }
    }; 

    if (mutators[type] === undefined) {
        console.log("UNDEFINED MUTATOR KEY: ", type); 
        debugger; 
    }

    return mutators[type](); 

}
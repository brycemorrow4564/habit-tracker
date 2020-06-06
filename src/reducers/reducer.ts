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

    let today: moment.Moment = moment(); 
    let startDate: moment.Moment = today.subtract(habitHistoryLength - 1, 'days'); 

    const table: HabitTable = new HabitTable(); 

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

const numWeeks: 1 | 2 = 2; 
const windowSize: 7 | 14 = (numWeeks * 7) as 7 | 14; 
const table: HabitTable = dummyHabitTable(); 
const week: Week = new Week(1); // a week that starts on monday 
const weeksWindower: WeeksWindower = new WeeksWindower(table.getMaxDate(), numWeeks, week); 

export const reducerInitialState: ReducerState = {

    // TODO:    the cellHeight and cellWidth should start as null 
    //          values and be assigned based on a hook 
    
    "singleWeekViewOffset": 4, 
    "cellWidth": null,                              // the width of grid cells for habit tracking
    "cellHeight": null,                             // the height of grid cells for habit tracking
    "windowSize": windowSize as 7 | 14,             // the temporal width (in days) of current time period (summarized in view) 
    "habitTable": _.cloneDeep(table),               // an instance of HabitTable 
    "weeksWindower": _.cloneDeep(weeksWindower),    // an instance of WeeksWindower 
    "yAnchors": [], 
    "xAnchors": []
}; 

export interface ReducerState {
    singleWeekViewOffset: number, 
    cellWidth: number | null, 
    cellHeight: number | null, 
    windowSize: 7 | 14, 
    habitTable: HabitTable, 
    weeksWindower: WeeksWindower, 
    yAnchors: number[], 
    xAnchors: number[]
}

export type ReducerAction = [string, any]; 

export function reducer(state: ReducerState, action: ReducerAction) {

    let type: string = action[0]; 
    let payload: any = action[1]; 

    const mutators: { [key: string]: any } = { 
        'shift window': () => {
            let forwards = payload; 
            let weeksWindower = _.cloneDeep(state.weeksWindower); 
            if (forwards) {
                weeksWindower.shiftForwards(); 
            } else {
                weeksWindower.shiftBackwards(); 
            }
            return { ...state, weeksWindower }; 
        }, 
        'update x anchors': () => {
            return { ...state, xAnchors: payload }; 
        },
        'update y anchors': () => {
            return { ...state, yAnchors: payload }; 
        }
    }; 

    if (mutators[type] === undefined) {
        console.log("UNDEFINED MUTATOR KEY: ", type); 
        debugger; 
    }

    return mutators[type](); 

}
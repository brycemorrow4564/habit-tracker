import _ from "lodash";
import moment from "moment"; 
import { 
    HabitHistory, 
    HabitTable, 
    HabitRegistry, 
    HabitFrequencies, 
    Week, 
    WeeksWindower
} from "../utils/time"; 

let numHabits = 10; 
let habitHistoryLength = 34; 

let dummyHabitTable = (registry: HabitRegistry) => {

    let today: moment.Moment = moment(); 
    let startDate: moment.Moment = today.subtract(habitHistoryLength - 1, 'days'); 

    const table: HabitTable = new HabitTable(); 

    for (let i of _.range(0, numHabits)) {
        let history = new HabitHistory(); 
        let curr = startDate.clone(); 
        for (let j of _.range(0, habitHistoryLength)) {
            if (Math.random() < .5) {
                history.set(curr.clone(), 1); 
            }
            curr.add(1, 'day'); 
        }
        let name = `habit-${i}`
        table.add(name, history); 
        registry.register(name, 
                        Math.random() < .5 ? HabitFrequencies.Daily : HabitFrequencies.Weekly,
                        Math.random() < .5 ? 'fitness' : undefined);
    }

    return table; 
}; 

const numWeeks: 1 | 2 = 2; 
const windowSize: 7 | 14 = (numWeeks * 7) as 7 | 14; 
const registry: HabitRegistry = new HabitRegistry(); 
const table: HabitTable = dummyHabitTable(registry); 
const week: Week = new Week(1); // a week that starts on monday 
const weeksWindower: WeeksWindower = new WeeksWindower(table.getMaxDate(), numWeeks, week); 

export const reducerInitialState: ReducerState = {
    
    "today": moment(),                              // the current day 
    "singleWeekViewOffset": 4, 
    "cellWidth": null,                              // the width of grid cells for habit tracking
    "cellHeight": null,                             // the height of grid cells for habit tracking
    "windowSize": windowSize as 7 | 14,             // the temporal width (in days) of current time period (summarized in view) 
    "habitTable": _.cloneDeep(table),               // an instance of HabitTable 
    "weeksWindower": _.cloneDeep(weeksWindower),    // an instance of WeeksWindower 
    "habitRegistry": _.cloneDeep(registry), 
    "dy": 0,
    "rowHeights": [], 
    "rowMarginBottom": 0, 
    "colWidths": [], 
    "timeAxisItemSpacing": 0

}; 

export interface ReducerState {
    today: moment.Moment, 
    singleWeekViewOffset: number, 
    cellWidth: number | null, 
    cellHeight: number | null, 
    windowSize: 7 | 14, 
    habitRegistry: HabitRegistry, 
    habitTable: HabitTable, 
    weeksWindower: WeeksWindower, 
    dy: number, 
    rowHeights: number[], 
    rowMarginBottom: number, 
    colWidths: number[], 
    timeAxisItemSpacing: number
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
        'update dy': () => {
            return { ...state, dy: payload }; 
        },
        'update list item dimensions': () => {
            let [heights, marginBottom] = payload; 
            return { ...state, rowHeights: heights, rowMarginBottom: marginBottom }; 
        }, 
        'update axis item dimensions': () => {
            let [widths, timeAxisItemSpacing] = payload; 
            return { ...state, colWidths: widths, timeAxisItemSpacing }; 
        }, 
        'set value habit table': () => {
            let [ri, ci, value] = payload; 
            let habitTable = _.cloneDeep(state.habitTable); 
            let weeksWindower = _.cloneDeep(state.weeksWindower); 
            habitTable.setByIndex(ri, ci, value, weeksWindower); 
            return { ...state, habitTable, weeksWindower }; 
        }, 
        'create habit': () => {
            let habitTable = _.cloneDeep(state.habitTable); 
            habitTable.addNewHabit(`habit-${habitTable.size()}`); 
            return { ...state, habitTable }; 
        }
    }; 

    if (mutators[type] === undefined) {
        console.log("UNDEFINED MUTATOR KEY: ", type); 
        debugger; 
    }

    return mutators[type](); 

}
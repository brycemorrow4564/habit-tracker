import _ from "lodash";
import moment from "moment"; 
import { 
    HabitHistory, 
    HabitTable, 
    HabitRegistry, 
    HabitFrequencies, 
    Week, 
    WeeksWindower, 
    KeyedBijection
} from "../utils/time"; 

let numHabits = 5; 
let habitHistoryLength = 14; 

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
                        Math.random() < .5 ? 'fitness' : 'hygiene');
    }

    return table; 
}; 

const numWeeks: 1 | 2 = 2; 
const windowSize: 7 | 14 = (numWeeks * 7) as 7 | 14; 
const registry: HabitRegistry = new HabitRegistry(); 
const table: HabitTable = dummyHabitTable(registry);
let colors: Array<string> = ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]; 
const labels: Array<string> = registry.getLabels();
const labelColors: Array<string> = labels.map((d,i) => colors[i]); 
const labelsColorsBijection: KeyedBijection<string, string> = new KeyedBijection('labels', labels, 'colors', labelColors); 
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
    "labelsColorsBijection": labelsColorsBijection, 
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
    dy: number, 
    rowHeights: number[], 
    rowMarginBottom: number, 
    colWidths: number[], 
    timeAxisItemSpacing: number,
    habitRegistry: HabitRegistry, 
    habitTable: HabitTable, 
    labelsColorsBijection: KeyedBijection<string, string>, 
    weeksWindower: WeeksWindower,
};

export type ReducerAction = [string, any]; 

const mutators: { [key: string]: any } = { 
    'shift window': (state: ReducerState, [type, payload]: ReducerAction) => {
        let forwards = payload; 
        let weeksWindower = _.cloneDeep(state.weeksWindower); 
        if (forwards) {
            weeksWindower.shiftForwards(); 
        } else {
            weeksWindower.shiftBackwards(); 
        }
        return { ...state, weeksWindower }; 
    }, 
    'update dy': (state: ReducerState, [type, payload]: ReducerAction) => {
        return { ...state, dy: payload }; 
    },
    'update list item dimensions': (state: ReducerState, [type, payload]: ReducerAction) => {
        let [heights, marginBottom] = payload; 
        return { ...state, rowHeights: heights, rowMarginBottom: marginBottom }; 
    }, 
    'update axis item dimensions': (state: ReducerState, [type, payload]: ReducerAction) => {
        let [widths, timeAxisItemSpacing] = payload; 
        return { ...state, colWidths: widths, timeAxisItemSpacing }; 
    }, 
    'set value habit table': (state: ReducerState, [type, payload]: ReducerAction) => {
        let [ri, ci, value] = payload; 
        let habitTable = _.cloneDeep(state.habitTable); 
        habitTable.setByIndex(ri, ci, value, state.weeksWindower); 
        return { ...state, habitTable, weeksWindower }; 
    }, 
    'create habit': (state: ReducerState, [type, payload]: ReducerAction) => {
        let habitTable = _.cloneDeep(state.habitTable); 
        habitTable.addNewHabit(`habit-${habitTable.size()}`); 
        return { ...state, habitTable }; 
    }
}; 


export function reducer(state: ReducerState, action: ReducerAction) {

    let type: string = action[0]; 
    if (mutators[type] === undefined) {
        throw Error("UNDEFINED MUTATOR KEY: " + type); 
    }

    return mutators[type](state, action); 

}
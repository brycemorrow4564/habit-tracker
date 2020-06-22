import _ from "lodash";
import moment from "moment"; 
import { 
    HabitHistory, 
    HabitTable, 
    HabitFrequencies, 
    Week, 
    WeeksWindower,
} from "../utils/time"; 

export interface Habit {
    user_id: string, 
    habit_id: string, 
    color: string, 
    label: string, 
    observations: Array<{ timestamp: Date, value: number }>
};

// let colors: Array<string> = ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]; 

const numWeeks: 1 | 2 = 2; 
const windowSize: 7 | 14 = (numWeeks * 7) as 7 | 14; 
const table: HabitTable = new HabitTable();
const week: Week = new Week(1); // a week that starts on monday 
const weeksWindower: WeeksWindower = new WeeksWindower(table.getMaxDate(), numWeeks, week); 

export const reducerInitialState: ReducerState = {

    "user_id": "bam4564", 
    "habitIds": [], 
    "habitMap": new Map(), 
    "habitTableChanges": {
        habit_id: '', 
        count: 0, 
        timestamp: new Date(), 
        value: 0
    },
    "xCoords": [], 
    "createModalVisible": false, 
    "updateModalVisible": false, 
    "updateHabitId": null, 
    
    "today": moment(),                              // the current day 
    "singleWeekViewOffset": 4, 
    "cellWidth": null,                              // the width of grid cells for habit tracking
    "cellHeight": null,                             // the height of grid cells for habit tracking
    "windowSize": windowSize as 7 | 14,             // the temporal width (in days) of current time period (summarized in view) 
    "habitTable": _.cloneDeep(table),               // an instance of HabitTable 
    "weeksWindower": _.cloneDeep(weeksWindower),    // an instance of WeeksWindower 
    "dy": 0,
    "rowHeights": [], 
    "rowMarginBottom": 0, 
    "colWidths": [], 
    "timeAxisItemSpacing": 0

}; 

export interface ReducerState {

    user_id: string,                    // username of the current user 
    habitIds: Array<string>,            // the set of all habit ids for the current user  
    habitMap: Map<string, Habit>,       // map from habit name to habit object (from server)
    habitTableChanges: {
        habit_id: string, 
        count: number, 
        timestamp: Date, 
        value: number
    },
    xCoords: Array<number>, 
    createModalVisible: boolean, 
    updateModalVisible: boolean, 
    updateHabitId: string | null




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
    habitTable: HabitTable, 
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
        return { ...state, xCoords: payload }; 
    }, 
    'set value habit table': (state: ReducerState, [type, payload]: ReducerAction) => {
        let [ri, ci, value] = payload; 
        let habitTable = _.cloneDeep(state.habitTable); 
        let habitTableChanges = {
            count: state.habitTableChanges.count + 1, 
            habit_id: state.habitTable.getNames()[ri], 
            timestamp: state.weeksWindower.start().add(ci, 'days').toDate(), 
            value 
        };
        habitTable.setByIndex(ri, ci, value, state.weeksWindower); 
        return { ...state, habitTable, weeksWindower, habitTableChanges }; 
    }, 

    'create habit': (state: ReducerState, [type, habit]: ReducerAction) => {
        let habitTable = _.cloneDeep(state.habitTable); 
        let habitMap = _.cloneDeep(state.habitMap); 
        let { habit_id }: Habit = habit; 
        habitMap.set(habit_id, habit); 
        habitTable.add(habit_id, new HabitHistory()); 
        return { ...state, habitTable, habitMap }; 
    }, 
    'create habits': (state: ReducerState, [type, habits]: ReducerAction) => {
        let habitTable = _.cloneDeep(state.habitTable); 
        let habitMap = _.cloneDeep(state.habitMap); 
        for (let habit of habits) {
            let { habit_id, observations }: Habit = habit; 
            habitMap.set(habit_id, habit); 
            habitTable.add(habit_id, new HabitHistory(observations)); 
        }
        return { ...state, habitTable, habitMap }; 
    }, 
    'set update modal visible': (state: ReducerState, [type, updateHabitId]: ReducerAction) => {
        return { ...state, updateModalVisible: true, updateHabitId }; 
    }, 
    'set update modal hidden': (state: ReducerState, [type, _]: ReducerAction) => {
        return { ...state, updateModalVisible: false }; 
    }, 
    'set create modal visible': (state: ReducerState, [type, _]: ReducerAction) => {
        return { ...state, createModalVisible: true }; 
    }, 
    'set create modal hidden': (state: ReducerState, [type, _]: ReducerAction) => {
        return { ...state, createModalVisible: false }; 
    }, 
    'update habit': (state: ReducerState, [type, [oldHabitId, habit]]: ReducerAction) => {
        let habitTable = _.cloneDeep(state.habitTable); 
        let habitMap = _.cloneDeep(state.habitMap); 
        let { habit_id }: Habit = habit; 
        habitMap.delete(oldHabitId); 
        habitMap.set(habit_id, habit); 
        habitTable.renameHabit(oldHabitId, habit_id); 
        return { ...state, habitTable, habitMap }; 
    }, 
}; 

export function reducer(state: ReducerState, action: ReducerAction) {

    let type: string = action[0]; 
    if (mutators[type] === undefined) {
        throw Error("UNDEFINED MUTATOR KEY: " + type); 
    }

    console.log(type); 

    return mutators[type](state, action); 

}
import _ from "lodash";
import moment from "moment"; 

function weekIndexMapper(dayIndex) {
return ['MON','TUE','WED','THU','FRI','SAT','SUN'][dayIndex]; 
}

let numHabits = 10; 
let habitHistoryLength = 34; 

const activeColor = "#6ded81" ; 
const inactiveColor = "#eeeae8";

const colorTransitionDuration = 250; 
const scaleDuration = 1250; 
const opacityDuration = 1250;
const translateDuration = 1500;

let nextSunday = (date) => {
    // sets date to the next sunday if it is not already sunday 
    let day = date.day(); 
    if (day !== 0) {
        date.add(7-day);
    }
    return date; 
}; 

let dummyData = () => {

    let today = moment(); 
    let startDate = today.subtract(habitHistoryLength - 1, 'days'); 

    const data = []; 
    for (let i of _.range(0, numHabits)) {
        let row = []; 
        for (let j of _.range(0, habitHistoryLength)) {
            row.push(Math.random() < .5 ? 1 : 0); 
        }
        data.push(row); 
    }

    return { data, day0: startDate }; 
}; 

const { data, day0 } = dummyData(); 
const initDateMax = nextSunday(moment()); 
const initDateMin = initDateMax.clone().subtract(6, 'days'); 

export const reducerInitialState = {
    "cellWidth": 40, 
    "cellHeight": 40, 
    "period": 7, 
    "windowSize": 7, 
    "minScale": .1, 
    "maxScale": 1, 
    "singleWeekViewOffset": 6, 
    "singleWeekXAnchors": null, 
    "numHabits": numHabits, 
    "habitTable": data, 
    "today": moment(),                                 // the current day
    "dateMin": day0,                                // the first date we started recording habit data 
    "dateMax": initDateMax,                         // the last day (sunday) in the current week 

    "windowStartDate": initDateMin,                 // the first day (monday) in the current selected week  
    "windowEndDate": initDateMax,                 // the last day (sunday) in the current selected week 
    
    "windowStartIndex": habitHistoryLength - 7,      // the index into habitTable of the first day (monday) in the current selected week 
    "windowEndIndex": habitHistoryLength - 1,        // the index into habitTable of the last day (sunday) in the current selected week 
    
    "animations": {
        'singleWeekView-circles-opacity': [],
        'singleWeekView-circles-fill': [],
        'singleWeekView-circles-transform': []
    }, 
    "queuedAnimations": []
}; 

export function reducer(state, [type, payload]) {

    const mutators = { 

        'set period': () => {
            return { ...state, period: payload };  
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
        'trigger animation': () => {
            // let queuedAnimations = [];
            // for (let { key, delay, duration, type, startValue, endValue } of payload) {
            //     queuedAnimations.push({ key, duration, type, startValue, endValue }); 
            // }
            // return { ...state, queuedAnimations }; 
        }, 
        'set habitTableIndexRange': () => {
            let [windowStartIndex, windowEndIndex] = payload; 
            return { ...state, windowStartIndex, windowEndIndex }; 
        }
        
    }; 

    if (mutators[type] === undefined) {
        console.log("UNDEFINED MUTATOR KEY: ", type); 
        debugger; 
    }

    return mutators[type](); 

}
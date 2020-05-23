import _ from "lodash";
import moment from "moment"; 

function weekIndexMapper(dayIndex) {
    return ['MON','TUE','WED','THU','FRI','SAT','SUN'][dayIndex]; 
}

function clamp(v, vmin, vmax) {
    // clamps a value to a specified range 
    return  v >= vmin && v <= vmax ?    v : 
            v < vmin ?                  vmin :   
                                        vmax; 
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

let shiftWindowDays = (state, nDays) => {
    let { windowStartIndex, windowEndIndex, windowStartDate, windowEndDate } = state; 
    let newWindowStartIndex = windowStartIndex - nDays; 
    let newWindowEndIndex = windowEndIndex - nDays; 
    let newWindowStartDate = windowStartDate.clone().add(nDays, 'days'); 
    let newWindowEndDate = windowEndDate.clone().add(nDays, 'days'); 
    return { 
        windowStartIndex: newWindowStartIndex, 
        windowEndIndex: newWindowEndIndex, 
        windowStartDate: newWindowStartDate, 
        windowEndDate: newWindowEndDate
    }; 
}

// IMPORTANT ASSUMPTION: the habitTable stores dates in reverse order 
// i.e. the lowest index corresponds to the most recent date 
const { data, day0 } = dummyData(); 
const weekData = data.map(row => row.slice(0, 7)); 
const dateEnd = nextSunday(moment()); 
const windowStart = dateEnd.clone().subtract(6, 'days'); 

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
    
    "habitTable": data,                             // current users history for all habits (each row is a habit with cols being days)
    "weekData": weekData,                           // the data for the current week  

    "dateMin": day0,                                // the first date we have habitTable data 
    "dateMax": dateEnd,                             // the last date of the current week

    "windowStartDate": windowStart,                 // the first day (sunday) in the current selected week  
    "windowEndDate": dateEnd,                       // the last day (saturday) in the current selected week 
    "windowStartIndex": 0,                          // the index into habitTable of the first day (sunday) in the current selected week 
    "windowEndIndex": 6,                            // the index into habitTable of the last day (saturday) in the current selected week 
    
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
        'shift week backwards': () => {
            if (state.windowEndIndex + 7 >= habitHistoryLength) {
                // cannot shift the window backwards so we abort the shift request 
                return { ...state }; 
            } else {
                // can shift the window backwards. shift both indices and 
                let { windowStartIndex, windowEndIndex, windowStartDate, windowEndDate } = shiftWindowDays(state, -7); 
                return { ...state, windowStartIndex, windowEndIndex, windowStartDate, windowEndDate };
            }
        },
        'shift week forwards': () => {
            if (state.windowStartIndex - 7 < 0) {
                // cannot shift the window forwards so we abort the shift request 
                return { ...state }; 
            } else {
                // can shift the window forwards
                let { windowStartIndex, windowEndIndex, windowStartDate, windowEndDate } = shiftWindowDays(state, 7); 
                return { ...state, windowStartIndex, windowEndIndex, windowStartDate, windowEndDate }; 
            }
        },
        // 'trigger animation': () => {
            // let queuedAnimations = [];
            // for (let { key, delay, duration, type, startValue, endValue } of payload) {
            //     queuedAnimations.push({ key, duration, type, startValue, endValue }); 
            // }
            // return { ...state, queuedAnimations }; 
        // }, 
    }; 

    if (mutators[type] === undefined) {
        console.log("UNDEFINED MUTATOR KEY: ", type); 
        debugger; 
    }

    return mutators[type](); 

}
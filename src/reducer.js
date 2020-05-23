import _ from "lodash";

let numHabits = 10; 
let habitHistoryLength = 34; 

const activeColor = "#6ded81" ; 
const inactiveColor = "#eeeae8";

const colorTransitionDuration = 250; 
const scaleDuration = 1250; 
const opacityDuration = 1250;
const translateDuration = 1500;

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
    "habitTable": _.range(0, numHabits).map(i => _.range(0, habitHistoryLength).map(e => Math.random() < .5 ? 1 : 0)), 
    
    // TODO: add some field that explicitly calculates the temporal period the index range covers 
    "habitTableStartIndex": 0, 
    "habitTableEndIndex": 6, 

    "currentDayIndex": 0, 
    
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
            let [habitTableStartIndex, habitTableEndIndex] = payload; 
            return { ...state, habitTableStartIndex, habitTableEndIndex }; 
        }
        
    }; 

    if (mutators[type] === undefined) {
        console.log("UNDEFINED MUTATOR KEY: ", type); 
        debugger; 
    }

    return mutators[type](); 

}
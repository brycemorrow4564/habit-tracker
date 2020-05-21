import _ from "lodash";

let numHabits = 10; 
let habitHistoryLength = 34; 

export const reducerInitialState = {
    "cellWidth": 40, 
    "cellHeight": 40, 
    "period": 7, 
    "windowSize": 7, 
    "minScale": .1, 
    "maxScale": 1, 
    "singleWeekViewOffset": 6, 
    "singleWeekXAnchors": null, 
    "habitHistories": _.range(0, numHabits).map(i => _.range(0, habitHistoryLength).map(e => Math.random() < .5 ? 1 : 0))
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
            let habitHistories = _.cloneDeep(state.habitHistories); 
            let [r,c,v] = payload; 
            habitHistories[r][c] = v;
            return { ...state, habitHistories }; 
        }
        
    }; 

    if (mutators[type] === undefined) {
        console.log("UNDEFINED MUTATOR KEY: ", type); 
        debugger; 
    }

    return mutators[type](); 

}
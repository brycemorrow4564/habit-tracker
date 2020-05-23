import _ from "lodash";
import moment from "moment"; 

export const reducerInitialState = {
    data: {}
}; 

const mutators = { 
    'register animation': ((state, [type, payload]) => {
        const data = _.cloneDeep(state.data); 
        let { groupId, groupIndex } = payload; 

        // create a hierarchical index into data for this particular svg element 
        // the object at this location will contain the property values being intrpolated.
        if (!Object.keys(data).includes(groupId)) {
            data[groupId] = {}; 
        }
        if (!Object.keys(data[groupId]).includes(groupIndex)) {
            data[groupId][groupIndex] = [] 
        }
        // add the animation to a queue of animations at this index 
        data[groupId][groupIndex].push(payload); 

        // note nothing is run at this stage, when components render for the first time they 
        // will register their animation using the useAnimationRegistrar hook. Later, they will 
        // trigger animations via another mechanism 
        return { ...state, data };  
    }), 
    'trigger animation': ((state, [type, groupId]) => {
        const { data } = state;
        const interpolations = {}; 
        let groupData = data[groupId]; 
        let groupKeys = Object.keys(groupData);
        for (let groupId of groupKeys) {
            let animations = groupData[groupId]; 
            for (let ani of animations) {

            }
        }
        // let groupIndices = Object.keys(groupData).map(keyStr => JSON.parse(keyStr)); 
        // console.log(groupIndices); 
    })
}; 

export function reducer(state, action) {

    let type = action[0]; 
    if (mutators[type] === undefined) {
        console.log("UNDEFINED MUTATOR KEY: ", type); 
        debugger; 
    }

    return mutators[type](state, action); 

}
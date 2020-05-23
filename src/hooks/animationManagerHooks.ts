import * as React from "react"; 
import { useAnimationContext } from "../contexts/animationContext"; 

export enum AnimationType {
    Color, 
    Transform, 
    Opacity 
}

export class Animation {

    constructor(
        public delay: number,           // the amount of time the manager waits after starting the  
                                        // animation group to begin the requested animation
        public duration: number,        // how long this animation runs for 
        public groupId: string,         // the group to which this property animation belongs 
                                        // animation groups are triggered by events, some example groups: 
                                        //  * the starting animation of dots moving from left to right
                                        //      with changing opacities and upscaling. 
                                        //  * the fill animation that occurs when a habit observation is toggled
                                        //  * the path connecting multiple dots when a streak exists
        public type: AnimationType,     // this request originated from an svg element. the type describes 
                                        // the kind of interpolator to use to get from startValue to endValue
        public propName: string,        // the name of the property being interpolated ('fill', 'transform', etc.)
        public startValue: any,         // start state of interpolator 
        public endValue: any,           // end state of interpolator 
        public groupIndex: any[]        // tuple constituting unique id for each registering element within group
    ) {
        this.delay = delay; 
        this.duration = duration; 
        this.groupId = groupId; 
        this.type = type; 
        this.propName = propName; 
        this.startValue = startValue; 
        this.endValue = endValue; 
        this.groupIndex = groupIndex; 
    }

}

// React hook to register animations 
export function useAnimationRegistrar(animation: Animation) {

    const { state, dispatch } = useAnimationContext();

    // One time setup:  register the animation so that our context stored 
    //                  the animation data so we can execute it at a later time 
    React.useEffect(() => {
        dispatch(['register animation', animation]);
    }, []); 

    return { state }; 
}; 

// React hook to get function to trigger animation 
export function useAnimationDispatcher() {

    const { dispatch } = useAnimationContext();

    // Exposes function to trigger animations 
    let triggerAnimation = (groupId: string) => {
        dispatch(['trigger animation', groupId]); 
    }

    return { triggerAnimation }; 
}

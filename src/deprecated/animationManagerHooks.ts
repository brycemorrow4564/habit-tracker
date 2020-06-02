import * as React from "react"; 
import _ from "lodash"
import { interpolateRgb, interpolateTransformCss } from "d3-interpolate"; 
import { easeSinIn } from "d3-ease"; 
import { useAnimationContext } from "./animationContext"; 
import AnimationInterpolator from "./AnimationInterpolator";

type AnimationInterpolator = (t: number) => string | number;

export enum AnimationType {
    Color, 
    Transform, 
    Opacity 
}

export class Animation {

    public interpolator: AnimationInterpolator;

    public startTime: number | null; 

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
        this.startTime = null;

        switch (type) {
            case AnimationType.Color: 
                this.interpolator = interpolateRgb(this.startValue, this.endValue) as AnimationInterpolator;
                break; 
            case AnimationType.Opacity: 
                this.interpolator = (t: number): string => {
                    return this.startValue + t * (this.endValue - this.startValue); 
                }; 
                break; 
            case AnimationType.Transform: 
                let { xMin, xMax, yMin, yMax, scaleMin, scaleMax } = this.startValue;
                let t0 = `  translate(${xMin}, ${yMin})
                            scale(${scaleMin})`;
                let t1 = `  translate(${xMax}, ${yMax})
                            scale(${scaleMax})`;
                this.interpolator = interpolateTransformCss(t0, t1); 
                break; 
            default: 
                throw Error('Unrecognized animation type'); 
        }
    }

    step(t: number) {
        return this.interpolator && this.interpolator(t); 
    }

    setStartTime(startTime: number) {
        this.startTime = startTime; 
    }

    generateInterpolationKey() {
        if (!this.startTime) {
            throw Error("tried to get animation key without starting it"); 
        }
        return `${this.startTime}-${this.groupId}-${this.groupIndex}-${this.propName}`;
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

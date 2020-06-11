import { easeCubic, easeSinIn, easePolyOut } from 'd3-ease'; 
import { interpolateTransformCss } from "d3-interpolate"; 
import { useAnimationContext } from "./animationContext"; 

export enum TweenableType {
    cssTransformString
}; 

export class Tweenable {

    private setter: any = null; 
    private toValue: any = null;                    // ending value for the tween 
    private interpolator: any = null;               // dynamically set based on user-defined type (delegate to d3-interpolate)
    private startTimestamp: number | null = null;   // timestamp when tween started 
    private activeDuration: number | null = null;   // the amount of time remaining (relative to most recent timestamp)
    private elapsed: number | null = null;          // the amount of time that has passed since the tween started
    private tweening: boolean = false;              // a boolean that is true only when a tween is occurring 
    private duration: number = 0;                   // the total duration of a tween 
    private easing: any = easeSinIn;                // easing function used to progress the value of t 

    constructor(private type: TweenableType, private value: any) {
        this.type = type; 
        this.value = value; 
    }

    running(): boolean {
        return this.tweening; 
    }

    getActiveDuration(): number {
        if (this.activeDuration === null) {
            throw Error('tried to get the active duration of an animation that is not in progress'); 
        }
        return (this.activeDuration as number); 
    }

    getValue() {
        return this.value; 
    }

    getElapsed() {
        return this.elapsed; 
    }

    getSetter() {
        return this.setter; 
    }

    paramaterize(toValue: any, duration: number, easing?: any): Tweenable {
        /*
        Paramaterize a tween with required properties. 
        Returns reference to self to enable method chaining 
        */
        this.toValue = toValue; 
        this.duration = duration; 
        if (easing) {
            this.easing = easing; 
        }        
        this.setInterpolator(); 
        return this; 
    }

    setInterpolator() {
        switch (this.type) {
            case TweenableType.cssTransformString: 
                this.interpolator = interpolateTransformCss(this.value, this.toValue); 
                break; 
            default: 
                throw new Error('unrecognized tween type');
        }
    }

    start(timestamp: number) {
        this.startTimestamp = timestamp; 
        this.activeDuration = this.duration; 
        this.elapsed = 0;
        this.tweening = true; 
    }

    update(timestamp: number) {
        this.elapsed = timestamp - (this.startTimestamp as number); 
        this.activeDuration = Math.max(this.duration - this.elapsed, 0); 
        this.tweening = this.activeDuration > 0; 
        let t = this.easing(this.elapsed / this.duration); 
        this.value = this.interpolator(t);
        return { value: this.value, finished: this.tweening === false }; 
    }

}

import moment from "moment"; 

/*
Some utility functions that rely on the moment.js library
*/

type WeekIndex =  0 | 1 | 2 | 3 | 4 | 5 | 6; 

export class HabitData {

    private values: Array<number>; 
    private dateIndex: { [key: string]: number };

    constructor() {
        // These two date structures allow us to reference / index habits
        this.values = [];       // stores the raw values of observations
        this.dateIndex = {};    // maps a date to an index of values 
    }

    set(date: moment.Moment, value: number) {
        /*
        record an observation for a habit at a given date with 
        a particular value; 
        */ 
        this.values.push(value); 
        this.dateIndex[date.format()] = this.values.length-1; 
    }

    get(d0: moment.Moment, d1: moment.Moment) {
        /*
        get all observations within a given window of time 
        this is an inclusive range [d0,d1]. This allows us  
        to get the relevant information out of the habit 
        table based on the current time window of analysis 
        */
        let data = []; 
        let curr = d0.clone(); 
        let wi = 0; 
        while (d1.diff(curr, 'days') >= 0) {
            let dateIndexKey = curr.format(); 
            if (dateIndexKey in this.dateIndex) {
                data.push({ 
                    index: wi, 
                    date: curr, 
                    value: this.values[this.dateIndex[dateIndexKey]] 
                });
            }
            curr.add(1, 'day'); 
            wi += 1; 
        }
        return data; 
    }

    getMinDate() {
        /*
        Returns the earliest date for which we have an observation
        */
        return moment.min(Object.keys(this.dateIndex).map(timeStr => moment(timeStr))); 
    }

    getMaxDate() {
        /*
        Returns the latest date for which we have an observation
        */
        return moment.max(Object.keys(this.dateIndex).map(timeStr => moment(timeStr))); 
    }

}

export class HabitTable {

    private nameIndex: { [key: string] : number };
    private habits: Array<HabitData>; 

    constructor() {
        this.nameIndex = {};    // maps name of habit to data index
        this.habits = [];       // stores HabitData instances in order they are added to 
    }

    private getHabitDataByName(name: string) {
        return this.habits[this.nameIndex[name]]; 
    }

    add(name: string, habit: HabitData) {
        this.habits.push(habit); 
        this.nameIndex[name] = this.habits.length-1; 
    }

    // delegates to habitData instance 
    set(name: string, date: moment.Moment, value: number) {
        this.getHabitDataByName(name).set(date, value); 
    }

    // delegates to habitData instance 
    get(name: string, d0: moment.Moment, d1: moment.Moment) {
        return this.getHabitDataByName(name).get(d0, d1); 
    }

    // delegates to habitData instance 
    getMinDate() {
        /*
        Returns the earliest date for which we have an observation
        */
        return moment.min(this.habits.map(habit => habit.getMinDate())); 
    }

    // delegates to habitData instance 
    getMaxDate() {
        /*
        Returns the earliest date for which we have an observation
        */
        return moment.max(this.habits.map(habit => habit.getMaxDate())); 
    }


}

export class Week {

    // labels is the ground-truth for week ordering (sunday -> saturday)
    // this is how moment.js represents a week so we do the same 
    public static labels = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']; 

    constructor(public offset: WeekIndex) {
        // 0 -> starts on sunday
        // 1 -> starts on monday 
        // i -> starts on ith element of Week.labels 
        this.offset = offset; 
    }

    getOffset() {
        return this.offset; 
    }

    getDay(logicalIndex: number) {
        /*
        let week = new Week(); 
        let i = 3; 
        week.offset(2) // this week starts 2 days after sunday so tuesday
        week.getDay(3) // will get the third day on week that starts on tuesday. returns friday 
        */
        return Week.labels[(logicalIndex + this.offset) % 7];    
    }

}

let shiftWindowDays = (windowStartDate: moment.Moment, windowEndDate: moment.Moment, nDays: number) => {
    return { 
        windowStartDate: windowStartDate.clone().add(nDays, 'days'), 
        windowEndDate: windowEndDate.clone().add(nDays, 'days')
    }; 
}

class WeeksWindower {

    /*
    A class that represents a window of either 1 or 2 weeks. 
    This window can shift to the left and right infinitely
    */

    constructor(initWindowEndDate: moment.Moment, 
                amount: 1 | 2, 
                weekStartOffset: Week) {

        // compute left bound
        let d0 = initWindowEndDate.clone(); 
        let diff = d0.day() - Week.getOffset(); 
        if (diff > 0) {
            d0.day(-diff); 
        } else if (diff < 0) {
            d0.day(-(7+diff)); 
        }
        // compute right bound 
        let d1 = d0.clone().add(1, 'weeks'); 
        // adjustment for 2 week case 
        if (amount === 2) {
            // adjust left bound to be 1 week to the left 
            // this ensures that current date will be in most 
            // recent week within this window 
            d0.day(-7);
        }

        // set the left and right bounds to the private 
    }
}

let computeWeekAlignedWindowAroundDate = (date, numWeeks, weekStartOffset) => {
    let d0, d1; 
    if (numWeeks === 1 | numWeeks === 2) {
        // compute left bound
        d0 = date.clone(); 
        let diff = d0.day() - weekStartOffset; 
        if (diff > 0) {
            d0.day(-diff); 
        } else if (diff < 0) {
            d0.day(-(7+diff)); 
        }
        // compute right bound 
        d1 = d0.clone().add(1, 'weeks'); 
        // adjustment for 2 week case 
        if (numWeeks === 2) {
            // adjust left bound to be 1 week to the left 
            // this ensures that current date will be in most 
            // recent week within this window 
            d0.day(-7);
        }
    } else {
        throw Error("unrecognized number of weeks");  
    }
    return { d0, d1 }; 
}
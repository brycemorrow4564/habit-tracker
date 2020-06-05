import moment from "moment"; 

/*
Some utility functions that rely on the moment.js library
*/

type WeekIndex =  0 | 1 | 2 | 3 | 4 | 5 | 6; 

export class HabitList {

}; 

export class Habit {

    /*
    * A habit can have a label 
    * each habit derives its color from its label 
    * each habit is associated with a HabitHistory
    */ 

    private label: string | null = null;

    constructor(private name: string) {
        this.name = name; 
    }
}; 

export class HabitObservation {

    constructor(public value: any) {
        this.value = value;
    }

}

export class HabitHistory {

    private values: Array<HabitObservation> = [];       // stores habit objects (wrappers around values)
    private dateIndex: { [key: string]: number } = {};  // maps a date string to an index of values 

    set(date: moment.Moment, value: number) {
        /*
        record an observation for a habit at a given date with 
        a particular value; 
        */ 
        this.values.push(new HabitObservation(value)); 
        this.dateIndex[date.format()] = this.values.length-1; 
    }

    getInWindow(d0: moment.Moment, d1: moment.Moment) {
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
                    value: this.values[this.dateIndex[dateIndexKey]].value 
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

export class Week {

    // labels is the ground-truth for week ordering (sunday -> saturday)
    // this is how moment.js represents a week so we do the same 
    public static labels = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']; 

    constructor(public offset: WeekIndex) {
        // 0 -> starts on sunday
        // i -> starts on ith element of Week.labels 
        this.offset = offset; 
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

export class WeeksWindower {

    /*
    A class that represents a window of either 1 or 2 weeks. 
    This window can shift to the left and right infinitely
    */
    private d0: moment.Moment;
    private d1: moment.Moment; 

    constructor(dateInWindow: moment.Moment, 
                private amount: 1 | 2, 
                weekStartOffset: Week) {

        // compute left bound
        let d0 = dateInWindow.clone(); 
        let diff = d0.day() - weekStartOffset.offset; 
        if (diff > 0) {
            d0.subtract(diff, 'days'); 
        } else if (diff < 0) {
            d0.subtract(7+diff); 
        }
        // compute right bound 
        let d1 = d0.clone().add(1, 'week').subtract(1, 'day'); 
        if (amount === 2) {
            // adjust left bound to be 1 week to the left 
            // this ensures that current date will be in most 
            // recent week within this window 
            d0.subtract(1, 'week');
        }

        // set the left and right bounds to the private 
        this.d0 = d0; 
        this.d1 = d1; 
    }

    get start() {
        return this.d0; 
    }

    get end() {
        return this.d1; 
    }

    shiftBackwards() {
        // shifts both points amount weeks into the past 
        this.d0.subtract(this.amount, 'weeks'); 
        this.d1.subtract(this.amount, 'weeks'); 
    }

    shiftForwards() {
        // shifts both points amount weeks into the future 
        this.d0.add(this.amount, 'weeks'); 
        this.d1.add(this.amount, 'weeks'); 
    }
    
    window() {
        /*
        Iterates through all days in the window 
        */
        let d = this.d0.clone();
        let dates = []; 
        while (this.d1.diff(d, 'days') >= 0) {
            dates.push(d.clone()); 
            d.add(1, 'day'); 
        }
        return dates; 
    }

}

export class HabitTable {

    private names: Array<string>; 
    private namesIndex: Array<number>; 
    private nameIndex: { [key: string] : number };
    private habits: Array<HabitHistory>; 

    constructor() {
        this.names = [];        // stores ids in order added 
        this.namesIndex = [];   // the order of names by index 
        this.nameIndex = {};    // maps name of habit to data index
        this.habits = [];       // stores HabitHistory instances in order they are added to 
    }

    private getHabitRowByName(name: string) {
        return this.habits[this.nameIndex[name]]; 
    }

    add(name: string, habit: HabitHistory) {
        this.names.push(name); 
        this.namesIndex.push(this.names.length-1); 
        this.habits.push(habit); 
        this.nameIndex[name] = this.habits.length-1; 
    }

    set(name: string, date: moment.Moment, value: number) {
        this.getHabitRowByName(name).set(date, value); 
    }

    get(name: string, d0: moment.Moment, d1: moment.Moment) {
        return this.getHabitRowByName(name).getInWindow(d0, d1); 
    }

    // getAll(weeksWindower: WeeksWindower) {
    //     for (let name of this.names) {
    //         let vals = this.get(name, weeksWindower.start, weeksWindower.end); 
    //     }
    // }

    getNames() {
        return this.namesIndex.map(i => this.names[i]); 
    }

    getMinDate() {
        /*
        Returns the earliest date for which we have an observation
        */
        return moment.min(this.habits.map(habit => habit.getMinDate())); 
    }

    getMaxDate() {
        /*
        Returns the earliest date for which we have an observation
        */
        return moment.max(this.habits.map(habit => habit.getMaxDate())); 
    }


    size() {
        return this.names.length;
    }


}
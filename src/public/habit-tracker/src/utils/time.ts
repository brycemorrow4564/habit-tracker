import moment from "moment"; 
import _ from "lodash"; 

type WeekIndex =  0 | 1 | 2 | 3 | 4 | 5 | 6; 

export enum HabitFrequencies { Daily, Weekly, BiWeekly };

export class HabitRegistry {

    /*
    Maps habit name to multiple habitg properties. Once habits
    are registered, their property values can be mutated. 
    */

    private map: Map<string,number> = new Map();        // maps habit name to index into property arrays
    private frequencies: Array<HabitFrequencies> = [];  // frequency of each habit 
    private labels: Array<string> = [];                 // habit label 
    private colors: Array<string> = [];                 // habit color (derivative of label)

    isRegistered(name: string) {
        return this.map.has(name); 
    }

    ensureRegistered(name: string) {
        if (!this.isRegistered(name)) {
            throw Error("tried to set value for unregistered habit");
        }
    }

    register(name: string, freq: HabitFrequencies, label?: string) {
        if (this.isRegistered(name)) {
            throw Error("duplicate habit registration"); 
        }
        this.map.set(name, this.frequencies.length); 
        this.frequencies.push(freq); 
        this.labels.push(label ? label : ''); 
    }

    setFreq(name: string, freq: HabitFrequencies) {
        this.ensureRegistered(name);
        this.frequencies[this.map.get(name) as number] = freq; 
    }

    setLabel(name: string, label: string) {
        this.ensureRegistered(name);
        this.labels[this.map.get(name) as number] = label; 
    }

    setColor(name: string, color: string) {
        this.ensureRegistered(name);
        this.colors[this.map.get(name) as number] = color; 
    }

    getLabels() {
        return _.uniq(this.labels.filter(g => g !== undefined));     
    }

    getLabel(name: string) {
        this.ensureRegistered(name); 
        return this.labels[this.map.get(name) as number]; 
    }




}; 

export class HabitObservation {

    constructor(public value: any) {
        this.value = value;
    }

}

export class HabitHistory {

    /*
    Sparse representation of a history for a single habit 
    */

    private map: Map<string, HabitObservation> = new Map();   // maps date string to habitobservation

    private dateToKey(d: moment.Moment) {
        return d.format('MM-DD-YY'); 
    }

    set(date: moment.Moment, value: number) {
        /*
        record an observation for a habit at a given date with 
        a particular value; 
        */ 
        let dateIndexKey: string = this.dateToKey(date);  
        let hasKey: boolean = this.map.has(dateIndexKey);
        if (hasKey && value === 0) {
            this.map.delete(dateIndexKey); 
        } else if (!hasKey && value == 1) {
            this.map.set(dateIndexKey, new HabitObservation(value)); 
        } 
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
        let end = d1.clone().add(1, 'day'); // add 1 day to last day to get end day for looping 
        for (let wi = 0; !curr.isSame(end, 'days'); wi++, curr.add(1, 'day')) {
            let dateIndexKey = this.dateToKey(curr);  
            let date = curr.clone(); 
            let value = this.map.has(dateIndexKey) ? (this.map.get(dateIndexKey) as HabitObservation).value : 0; 
            data.push({ index: wi, date, value });
        }
        return data; 
    }

    streakInWindow(d0: moment.Moment, d1: moment.Moment): Array<[number, number]> {
        /*
        get a list of all streaks in window 
        */
        let stack: Array<number> = []; 
        let streaks: Array<[number, number]> = []; 
        let curr: moment.Moment = d0.clone(); 
        let end: moment.Moment = d1.clone().add(1, 'day');  // add 1 day to last day to get end day for looping 
        let endCurrentStreak = () => {
            if (stack.length > 1) {
                streaks.push([stack[0], stack[stack.length-1]]); 
            }
            stack = []; 
        }
        for (let wi = 0; !curr.isSame(end, 'days'); wi += 1, curr.add(1, 'day')) {
            if (this.map.has(this.dateToKey(curr))) {
                stack.push(wi); 
            } else {
                endCurrentStreak();
            }
        }
        endCurrentStreak();
        return streaks; 
    }

    // TODO: if we bring these back, need to ensure map is non-empty or return null
    getMinDate() {
        /*
        Returns the earliest date for which we have an observation
        */
        return moment.min([...this.map.keys()].map(timeStr => moment(timeStr))); 
    }

    getMaxDate() {
        /*
        Returns the latest date for which we have an observation
        */
        return moment.max([...this.map.keys()].map(timeStr => moment(timeStr))); 
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

    start() {
        return this.d0.clone(); 
    }

    end() {
        return this.d1.clone(); 
    }

    getDateByWindowIndex(wi: number): moment.Moment {
        return this.start().add(wi, 'days'); 
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
        let d = this.start(); 
        let end = this.end().add(1, 'day'); 
        let dates = []; 
        while (!d.isSame(end, 'days')) {
            dates.push(d.clone()); 
            d.add(1, 'day'); 
        }
        return dates; 
    }

}

export class HabitTable {

    private names: Array<string>; 
    private nameIndex: { [key: string] : number };
    private habits: Array<HabitHistory>; 

    constructor() {
        this.names = [];        // stores habit ids in order added to table initially 
        this.nameIndex = {};    // maps name of habit to data index
        this.habits = [];       // stores HabitHistory instances in order they are added to 
    }

    private getHabitHistory(name: string) {
        return this.habits[this.nameIndex[name]]; 
    }

    add(name: string, habit: HabitHistory) {
        // Add a habit and associated data 
        this.names.push(name); 
        this.habits.push(habit); 
        this.nameIndex[name] = this.habits.length - 1; 
    }

    addNewHabit(name: string) {
        // Add a new habit and with initial data as zeros
        this.names.push(name); 
        this.habits.push(new HabitHistory())
        this.nameIndex[name] = this.habits.length - 1; 
    }

    setByIndex(ri: number, ci: number, value: number, weeksWindower: WeeksWindower) {
        let history: HabitHistory = this.getHabitHistory(this.names[ri]);
        let d: moment.Moment = weeksWindower.start().add(ci, 'days'); 
        history.set(d, value); 
    }

    get(name: string, d0: moment.Moment, d1: moment.Moment) {
        const history: HabitHistory = this.getHabitHistory(name); 
        return history.getInWindow(d0, d1); 
    }

    streak(name: string, d0: moment.Moment, d1: moment.Moment): Array<[number, number]> {
        const history: HabitHistory = this.getHabitHistory(name); 
        return history.streakInWindow(d0, d1); 
    }

    getNames() {
        return this.names; 
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

type Indexable = number | string; 
type StringToNumMap = { [key: string]: number }; 

export class KeyedBijection<A extends Indexable, B extends Indexable> {

    private indexA: StringToNumMap; 
    private indexB: StringToNumMap; 

    static indexify = (arr: Array<Indexable>) => arr.reduce((acc: StringToNumMap, cur: Indexable, i: number) => {
        acc[cur] = i; 
        return acc; 
    }, {}); 

    constructor(private keyA: string, 
                private listA: Array<A>, 
                private keyB: string, 
                private listB: Array<B>) {
        this.keyA = keyA; 
        this.listA = listA;
        this.indexA = KeyedBijection.indexify(this.listA);
        this.keyB = keyB;  
        this.listB = listB; 
        this.indexB = KeyedBijection.indexify(this.listB);
        this.ensureValid(); 
    }   

    ensureValid() {
        if (this.listA.length !== this.listB.length) {
            throw Error("mismatch in sizes between two internal lists"); 
        } else if (this.listA.length === 0) {
            throw Error("cannot have bijection between two empty sets"); 
        } else if (this.keyA.length === 0 || this.keyB.length === 0 || this.keyA === this.keyB) {
            throw Error("invalid keys"); 
        } else if (_.uniq(this.listA).length !== this.listA.length || _.uniq(this.listB).length !== this.listB.length) {
            throw Error("at least one set contains duplicate elements"); 
        }
    }

    getValue(setId: string, setValue: A | B): A | B {
        let isA = setId !== this.keyA; 
        let isB = setId !== this.keyB; 
        if (!isA && !isB) {
            throw Error('unrecognized set key'); 
        } else {
            if (isA) {
                return this.listA[this.indexA[setValue]]; 
            } else {
                return this.listB[this.indexB[setValue]]; 
            }
        }
    }

    getMappedValue(fromSetId: string, fromSetValue: A | B): A | B {
        let isA = fromSetId === this.keyA; 
        let isB = fromSetId === this.keyB; 
        if (!isA && !isB) {
            throw Error('unrecognized set key'); 
        } else {
            let index: number, value: A | B; 
            if (isA) {
                index = this.indexA[fromSetValue]; 
                value = this.listB[index]; 
            } else {
                index = this.indexB[fromSetValue]; 
                value = this.listA[index]; 
            }
            return value; 
        }
    }

    setValue(setId: string, setValue: A | B, newValue: A | B): void {
        let isA = setId !== this.keyA; 
        let isB = setId !== this.keyB; 
        if (!isA && !isB) {
            throw Error('unrecognized set key'); 
        } else {
            if (isA) {
                this.listA[this.indexA[setValue]] = newValue as A; 
            } else {
                this.listB[this.indexB[setValue]] = newValue as B; 
            }
        }
    }

}
import * as _mongodb from "mongodb";
import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Get, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import MongoDbConnectionUser from "../util/MongoDbConnectionUser"; 

// this link is helpful in understanding the below query 
// https://stackoverflow.com/questions/34431435/mongodb-update-an-object-in-nested-array
// await this.db.collection('habits').updateOne(
//     { user_id, habit_id, observations: { timestamp } },
//     { $set: { "observations.$.value" : value } }
// );

@Controller('api')
class DemoController extends MongoDbConnectionUser {

    public static readonly SUCCESS_MSG = 'success message ';

    @Get('habits/get/:user_id')
    private getHabits(req: Request, res: Response) {
        /*
        Returns a list of all habit objects for the current user 
        */ 
        try {
            const { user_id } = req.params;
            let db_query = async () => {
                return await this.db.collection('habits').find({ user_id }).toArray(); 
            }
            db_query().then((habits) => {
                Logger.Info(DemoController.SUCCESS_MSG);
                return res.status(OK).json({ habits });
            });
        } catch (err) {
            Logger.Err(err, true);
            return res.status(BAD_REQUEST).json({
                error: err.message,
            });
        }
    }

    @Post('habits/create/:user_id/:new_habit_id')
    private createHabit(req: Request, res: Response) {
        /*
        Creates a new habit for a user 
        returns a copy of the created document to the user  
        */ 
        try {
            const { user_id, new_habit_id } = req.params;
            const color = '#00FF00'; 
            const label = 'default'; 
            const doc = { user_id, habit_id: new_habit_id, color, label, observations: [] };
            let db_update = async () => {
                await this.db.collection('habits').insertOne(doc); 
            }
            db_update().then(() => {
                Logger.Info(DemoController.SUCCESS_MSG);
                return res.status(OK).json(doc);
            });
        } catch (err) {
            Logger.Err(err, true);
            return res.status(BAD_REQUEST).json({
                error: err.message,
            });
        }
    }

    @Post('habits/update/:user_id/:habit_id/:timestamp/:value')
    private updateHabit(req: Request, res: Response) {
        /*
        Update a habit observation for a given user 
        */ 
        try {
            const { user_id, habit_id, timestamp, value } = req.params;
            const num_value: number = parseInt(value); 
            const date: Date = new Date(timestamp);  
            let db_update = async () => {
                if (num_value === 0) {
                    // if value is 0, we remove the entry from the db
                    return await this.db.collection('habits').updateOne(
                        { user_id, habit_id },
                        { $pull: { observations : { timestamp: date } }}
                    );
                } else {
                    // if value is 1, we add an entry to the db 
                    return await this.db.collection('habits').updateOne(
                        { user_id, habit_id },
                        { $push: { observations : { timestamp: date, value: num_value } } }
                    ); 
                }
            }; 
            db_update().then(() => {
                Logger.Info(DemoController.SUCCESS_MSG);
                return res.status(OK).json({ success: true });
            });
        } catch (err) {
            Logger.Err(err, true);
            return res.status(BAD_REQUEST).json({
                error: err.message,
            });
        }
    }



}

export default DemoController;
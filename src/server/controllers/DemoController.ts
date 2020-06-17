import * as _mongodb from "mongodb";
import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Get, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import MongoDbConnectionUser from "../util/MongoDbConnectionUser"; 

interface Habit {
    user_id: string, 
    habit_id: string, 
    color: string
}

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

    @Get('habits/observations')

    @Post('habits/create/:user_id/:new_habit_id')
    private createNewHabit(req: Request, res: Response) {
        /*
        Creates a new habit for a user 
        assigns this habit a default color 
        */ 
        try {
            const { user_id, new_habit_id } = req.params;
            const color = '#00FF00'; 
            const doc: Habit = { user_id, habit_id: new_habit_id, color };
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



}

export default DemoController;
import * as _mongodb from "mongodb";
import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import MongoDbConnectionUser from "../util/MongoDbConnectionUser"; 

@Controller('api/say-hello')
class DemoController extends MongoDbConnectionUser {

    public static readonly SUCCESS_MSG = 'success message ';

    @Get(':user_id')
    private getHabitNames(req: Request, res: Response) {
        /*
        Returns a json object containing a list of all habits
        for the current user
        */ 
        try {
            const { user_id } = req.params;
            let db_query = async () => {
                const db: _mongodb.Db = this.db; 
                const col: _mongodb.Collection = await db.collection('habits'); 
                const docs: any = await col.find({ user_id }).project({ habit_id: 1, _id: 0 }).toArray();
                const habit_ids: Array<string> = docs.map((d: any) => (d.habit_id as string));  
                return habit_ids; 
            }
            db_query().then((habit_ids) => {
                Logger.Info(DemoController.SUCCESS_MSG);
                return res.status(OK).json({
                    habits: habit_ids
                });
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
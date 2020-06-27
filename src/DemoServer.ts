// import * as path from 'path';
import * as assert from 'assert'; 
import * as bodyParser from 'body-parser';
import * as _pino from 'express-pino-logger'; 
import * as _mongodb from "mongodb";
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

import DemoController from './server/controllers/DemoController';

const pino: _pino.HttpLogger = _pino(); 
const MongoClient: typeof _mongodb.MongoClient = _mongodb.MongoClient; 

class DemoServer extends Server {

    private static readonly SERVER_START_MSG: string    = 'Demo server started on port: ';
    private static readonly _DEV_MSG: string            = `Express Server is running in development mode. 
                                                           No front-end content is being served.`;
    private static readonly DATABASE_URI: string        = 'mongodb://localhost:27017'; 
    private static readonly DATABASE_NAME: string       = 'habit-tracker';

    constructor() {

        // Express + overnight.js configuration 
        super(true);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(pino); 
        let controller = new DemoController(); 
        super.addControllers(controller);

        // Point to front-end code
        if (process.env.NODE_ENV !== 'production') {
            const msg = DemoServer._DEV_MSG + process.env.EXPRESS_PORT;
            this.app.get('*', (req, res) => res.send(msg));
        }

        // attach the database connection to all controllers 
        MongoClient.connect(DemoServer.DATABASE_URI, { useUnifiedTopology: true }, (err, client) => {
            
            assert.equal(null, err);
            const db: _mongodb.Db = client.db(DemoServer.DATABASE_NAME);
            const success: boolean = controller.setDatabaseConnection(db); 
            if (success) {
                
                console.log("MONGODB INITIALIZED"); 

                // Collection of habits where each document
                // stores the meta-data associated with habits  
                // note: this does not include the set of observations for each habit 
                db.createCollection("habits", {
                    validator: {
                        $jsonSchema: {
                            bsonType: "object",
                            required: [ "user_id", "habit_id", "color", "label"],
                            properties: {
                                habit_id: {
                                    bsonType: "string",
                                    description: "habit uid"
                                },
                                user_id: {
                                    bsonType: "string",
                                    description: "user uid"
                                },
                                color: {
                                    bsonType: "string",
                                    description: "habit color"
                                }, 
                                label: {
                                    bsonType: "string", 
                                    description: "habit label"
                                }, 
                                frequency: {
                                    bsonType: "string", 
                                    description: "goal timeline for habit"
                                }, 
                                observations: {
                                    bsonType: "array",
                                    description: "set of observations for habit",
                                    uniqueItems: true,
                                    items: {
                                        bsonType: "object", 
                                        description: "individual habit observation", 
                                        required: ["timestamp", "value"], 
                                        properties: {
                                            timestamp: {
                                                bsonType: "date"
                                            }, 
                                            value: {
                                                bsonType: "int"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                
            } 
        });

    }

    public start(port: number): void {
        this.app.listen(port, () => {
            Logger.Imp(DemoServer.SERVER_START_MSG + port);
        });
    }
}

export default DemoServer;
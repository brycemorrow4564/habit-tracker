import * as _mongodb from "mongodb"; 

export default class MongoDbConnectionUser {

    public _db: _mongodb.Db | null = null; 

    setDatabaseConnection(db: _mongodb.Db): boolean {
        this._db = db; 
        return true; 
    }

    get db() {
        if (this._db === null) {
            throw Error("tried to user a MongoController without first setting the database connection"); 
        }
        return this._db; 
    }

}
import * as mongoose from "mongoose"

import BaseConfig from "./../config/base.config"

export default class MongoAccess {

    private readonly dbConnection: mongoose.Connection;

    constructor() {
        (mongoose as any).Promise = global.Promise;
        const connectionString = BaseConfig.dbConnectionString;
        if (connectionString) {
            this.dbConnection = mongoose.createConnection(connectionString);
        }
    }

    get connection() {
        return this.dbConnection;
    }
}
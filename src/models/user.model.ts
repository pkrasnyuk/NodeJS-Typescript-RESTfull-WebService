import * as mongoose from "mongoose"
import * as autoIncrement from "mongoose-auto-increment"
import * as uniqueValidator from "mongoose-unique-validator"

import Authentication from "./../security/authentication"

export enum UserType {
    Developer,
    Engineer,
    Manager,
    Client
}

export class User {

    username: String;
    email: String;
    passportHash: String;
    passportSalt: String;
    type: UserType;

    constructor(username: String, email: String, type: UserType, password: String = null) {
        this.username = username;
        this.email = email;
        this.type = type;
        if (password) {
            const encryptData = Authentication.encryptedPassword(password);
            if (encryptData) {
                this.passportSalt = encryptData.salt;
                this.passportHash = encryptData.hash;
            }
        }
    }
}

export class UserSchema {

    static get schema() {

        const userSchema = new mongoose.Schema({
                username: {
                    type: String,
                    lowercase: true,
                    unique: true,
                    required: [true, "can't be blank"],
                    match: [/^[a-zA-Z0-9]+$/, "is invalid"],
                    index: true
                },
                email: {
                    type: String,
                    lowercase: true,
                    unique: true,
                    required: [true, "can't be blank"],
                    match: [/\S+@\S+\.\S+/, "is invalid"],
                    index: true
                },
                passportHash: {
                    type: String,
                    required: true
                },
                passportSalt: {
                    type: String,
                    required: true
                },
                type: {
                    type: UserType,
                    required: true
                }
            },
            {
                timestamps: true
            });

        userSchema.plugin(autoIncrement.plugin,
            {
                model: "User",
                field: "id",
                startAt: 1,
                incrementBy: 1
            });

        userSchema.plugin(uniqueValidator,
            {
                message: "is already taken."
            });

        return userSchema;
    }
}
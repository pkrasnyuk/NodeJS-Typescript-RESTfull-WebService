import { UserType } from "./user.model"

export class DtoUser {

    token: String;

    constructor(
        public id: Number,
        public username: String,
        public email: String,
        public type: UserType) {
    }
}

export class LoginUser {
    constructor(
        public email: String,
        public password: String) {
    }
}

export class RegisterUser {
    constructor(
        public username: String,
        public email: String,
        public type: UserType,
        public password: String) {
    }
}
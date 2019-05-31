import * as autoIncrement from "mongoose-auto-increment"

import { User, UserSchema } from "../models/user.model"
import { DtoUser } from "../models/dto.user.model"
import MongoAccess from "../core/data_access/mongo.access"
import Authentication from "../security/authentication"

export default class UsersDbController {
    private users: any;

    constructor() {
        const connection = new MongoAccess().connection;
        autoIncrement.initialize(connection);
        this.users = connection.model("User", UserSchema.schema);
    }

    toDtoUser = (doc: any, includeToken = false) => {
        var dtoUser = new DtoUser(doc.id, doc.username, doc.email, doc.type);
        if (includeToken) {
            dtoUser.token = `Bearer ${Authentication.generateToken(doc)}`;
        }
        return dtoUser;
    }

    loginUser = (req: any, res: any) => {
        const email = req.body.email;
        const password = req.body.password;
        this.users.findOne({ email: email }).then((doc: any) => {
                if (doc) {
                    const isPasswordValid = Authentication.validePassword(password, doc.passportHash, doc.passportSalt);
                    if (isPasswordValid) {
                        res.send(this.toDtoUser(doc, true));
                        return;
                    }
                }

                res.status(404).send({
                    code: res.statusCode,
                    message: `An user with email=${email} and password= ${password} not found`
                });
            },
            (err: any) => {
                res.status(404).send({
                    code: res.statusCode,
                    message: err.message ? err.message : `An user with email=${email} and password= ${password} not found`
                });
            });
    }

    getUsers = (req: any, res: any) => {
        this.users.find({}).then((docs: any) => {
                if (docs) {
                    res.send(docs.map((doc: any) => this.toDtoUser(doc)));
                }

                res.status(500).send({
                    code: res.statusCode,
                    message: "Temporary error"
                });
            },
            (err: any) => {
                res.status(500).send({
                    code: res.statusCode,
                    message: err.message ? err.message : "Temporary error"
                });
            });
    }

    getUser = (req: any, res: any) => {
        const id = req.params.id;
        this.users.findOne({ id: id }).then((doc: any) => {
                if (doc) {
                    res.send(this.toDtoUser(doc));
                }

                res.status(404).send({
                    code: res.statusCode,
                    message: `An user with id=${id} not found`
                });
            },
            (err: any) => {
                res.status(404).send({
                    code: res.statusCode,
                    message: err.message ? err.message : `An user with id=${id} not found`
                });
            });
    }

    addUser = (req: any, res: any) => {
        if (!req.body) {
            res.status(404).send({
                code: res.statusCode,
                message: "Incorrect request"
            });

            return;
        }

        const user = new User(req.body.username, req.body.email, req.body.type, req.body.password);
        this.users.create(user).then((doc: any) => {
                res.send(this.toDtoUser(doc));
            },
            (err: any) => {
                res.status(500).send({
                    code: res.statusCode,
                    message: err.message ? err.message : "Temporary error"
                });
            });
    }

    updateUser = (req: any, res: any) => {
        if (!req.body) {
            res.status(404).send({
                code: res.statusCode,
                message: "Incorrect request"
            });

            return;
        }

        var result = Authentication.validateAuthenticateRequest(req);
        if (result && result.code !== 200) {
            res.status(result.code).send({
                code: res.statusCode,
                message: result.message ? result.message : "Incorrect request"
            });

            return;
        }

        var id = req.params.id;
        this.users.update({ id: id },
            { username: req.body.username, email: req.body.email, type: req.body.type }).then((doc: any) => {
                res.send(this.toDtoUser(doc));
            },
            (err: any) => {
                res.status(500).send({
                    code: res.statusCode,
                    message: err.message ? err.message : "Temporary error"
                });
            });
    }

    deleteUser = (req: any, res: any) => {
        var result = Authentication.validateAuthenticateRequest(req);
        if (result && result.code !== 200) {
            res.status(result.code).send({
                code: res.statusCode,
                message: result.message ? result.message : "Incorrect request"
            });

            return;
        }

        var id = req.params.id;
        this.users.remove({ id: id }).then((doc: any) => {
                res.send(doc.result);
            },
            (err: any) => {
                res.status(404).send({
                    code: res.statusCode,
                    message: err.message ? err.message : `An user with id=${id} not found`
                });
            });
    }
}
import * as cryptojs from "crypto-js"
import * as jsonwebtoken from "jsonwebtoken"

import BaseConfig from "./../core/config/base.config"

export default class Authentication {

    static encryptedPassword = (password: any) => {
        var passportSalt = cryptojs.lib.WordArray.random(16).toString(cryptojs.enc.Hex);
        var passportHash = cryptojs.PBKDF2(password, passportSalt, { keySize: 512, iterations: 1000 }).toString(cryptojs.enc.Hex);

        return { salt: passportSalt, hash: passportHash };
    }

    static validePassword = (password: any, passportHash: any, passportSalt: any) => {
        if (password && passportHash && passportSalt) {
            const hash = cryptojs.PBKDF2(password, passportSalt, { keySize: 512, iterations: 1000 }).toString(cryptojs.enc.Hex);
            return passportHash === hash;
        }
        return false;
    }

    static getTokenFromHeader(req: any) {
        if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Token" ||
            req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            return req.headers.authorization.split(" ")[1];
        }
        return null;
    }

    static generateToken(user: any) {
        return jsonwebtoken.sign(JSON.stringify({
                id: user.id,
                username: user.username,
                exp: Math.floor(Date.now() / 1000) + parseInt(BaseConfig.securityTokenExpiry)
            }),
            BaseConfig.securityPrivateKey);
    }

    static verifyToken(token: any) {
        try {
            const decoded = jsonwebtoken.verify(token, BaseConfig.securityPrivateKey);
            if (decoded) {
                return true;
            }
        } catch (err) {
        }
        return false;
    }

    static validateAuthenticateRequest(req: any) {

        let code = 200;
        let message = "";

        const token = Authentication.getTokenFromHeader(req);
        if (!token) {
            code = 404,
                message = "Incorrect request";
        }

        if (!Authentication.verifyToken(token)) {
            code = 401,
                message = "You are unauthorized for this operation";
        }

        return { code: code, message: message };
    }
}
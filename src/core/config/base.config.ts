import * as jsonfile from "jsonfile"

import { Common } from "./../helpers/common"

export default class BaseConfig {

    private static configFile: string = "./config_files/configuration.json";
    private static configProperties: any = jsonfile.readFileSync(BaseConfig.configFile);

    private static swaggerConfigFile: string  = "./config_files/swagger.json";
    private static swaggerConfig: any = jsonfile.readFileSync(BaseConfig.swaggerConfigFile);

    static get port() {
        let value = 1200;
        if (BaseConfig.configProperties && BaseConfig.configProperties.common && BaseConfig.configProperties.common.port) {
            value = BaseConfig.configProperties.common.port;
        }
        return `${Common.normalizePort(process.env.PORT || value)}`;
    }

    static get host() {
        let value = "localhost";
        if (BaseConfig.configProperties && BaseConfig.configProperties.common && BaseConfig.configProperties.common.domain) {
            value = BaseConfig.configProperties.common.domain;
        }
        return `${value}:${BaseConfig.port}`;
    }

    static get logDir() {
        let value = "log";
        if (BaseConfig.configProperties && BaseConfig.configProperties.common && BaseConfig.configProperties.common.logDir) {
            value = BaseConfig.configProperties.common.logDir;
        }
        return value;
    }

    static get faviconFile() {
        let value = "./img/favicon.ico";
        if (BaseConfig.configProperties && BaseConfig.configProperties.common && BaseConfig.configProperties.common.faviconFile) {
            value = BaseConfig.configProperties.common.faviconFile;
        }
        return value;
    }

    static get apiUrl() {
        return `http://${BaseConfig.host}/api`;
    }

    static get dbConnectionString() {
        let value = "mongodb://localhost:27017/users";
        if (BaseConfig.configProperties && BaseConfig.configProperties.db && BaseConfig.configProperties.db.connectionString) {
            value = BaseConfig.configProperties.db.connectionString;
        }
        return value;
    }

    static get securityPrivateKey() {
        let value = "39LvDSm45vjYOh90";
        if (BaseConfig.configProperties && BaseConfig.configProperties.security && BaseConfig.configProperties.security.privateKey) {
            value = BaseConfig.configProperties.security.privateKey;
        }
        return value;
    }

    static get securityTokenExpiry() {
        let value = "3600";
        if (BaseConfig.configProperties && BaseConfig.configProperties.security && BaseConfig.configProperties.security.tokenExpiry) {
            value = BaseConfig.configProperties.security.tokenExpiry;
        }
        return value;
    }

    static get swaggerDocument() {
        let document: any = {};
        if (BaseConfig.swaggerConfig) {
            document = BaseConfig.swaggerConfig;
        }
        document.host = `${BaseConfig.host}`;

        return document;
    }
}

Object.seal(BaseConfig);
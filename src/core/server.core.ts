import * as express from "express"
import * as favicon from "serve-favicon"
import * as bodyParser from "body-parser"
import * as path from "path"
import * as compression from "compression"
import * as morgan from "morgan"
import * as fs from "fs";
import * as methodOverride from "method-override"
import * as cors from "cors";
import * as winston from "winston";

import BaseConfig from "../core/config/base.config";
import UsersRouters from "../routes/users.routes";

class ServerCore {
	
	express: express.Application;

    private showExplorer = true;
	private logger: any;
	private swaggerUi = require('swagger-ui-express');
	
	constructor() {
        this.express = express();
		
		this.logInit();
        this.middleware();
        this.routes();
    }
	
	private logInit(): void {
		const logDir = BaseConfig.logDir;
		
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir);
		}
		
		const tsFormat = () => (new Date()).toLocaleTimeString();
		
		this.logger = new (winston.Logger)({
			transports: [
				new (winston.transports.Console)({
				timestamp: tsFormat,
				colorize: true,
				level: 'info'
			}),
			new (require('winston-daily-rotate-file'))({
				filename: `${logDir}/-server.log`,
				timestamp: tsFormat,
				datePattern: 'yyyy-MM-dd',
				prepend: true,
				level: 'info'
			})]
		});
	}
	
	private middleware(): void {
		this.logger.stream = {
			write: (message: any, encoding: any) => {
				this.logger.info(message);
			}
		};
        const appLogger = morgan("combined", { stream: this.logger.stream });
        this.express.use(appLogger);

        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));

        this.express.use(methodOverride("X-HTTP-Method"));
        this.express.use(methodOverride("X-HTTP-Method-Override"));
        this.express.use(methodOverride("X-Method-Override"));
        this.express.use(methodOverride("_method"));
        this.express.use(compression());
        this.express.use(cors());

        this.express.use((error: any, request: any, response: any, next: any) => {
            if (response.headersSent) {
                next(error);
            }

            if (error) {
                const data = `  error stack -> ${error.stack}`;
				this.logger.error(data);
                response.status(500).send({ code: 500, message: error.message });
            }
        });
	}
	
	private routes(): void {
		this.express.use(favicon(BaseConfig.faviconFile));
		this.express.use(express.static("./"));

        UsersRouters(this.express);
        this.express.use("/api", this.swaggerUi.serve, this.swaggerUi.setup(BaseConfig.swaggerDocument, this.showExplorer));
		
        this.express.get("*",
            (req: express.Request, res: express.Response) => {
                res.redirect("/api")
            });
    }
}

export default new ServerCore().express as any;
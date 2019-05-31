import * as http from "http"
    
import BaseConfig from "./core/config/base.config"
import ServerCore from "./core/server.core"

const port = BaseConfig.port;
const server = http.createServer(ServerCore);

server.listen(port, () => {
    console.log(`Users Server listening on port ${port}`);
    console.log("  Press CTRL-C to stop\n");
});
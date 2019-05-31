export class Common {

    static normalizePort(val: any): number | string | boolean {
        const port = parseInt(val, 10);

        if (isNaN(port)) {
            return val;
        }

        if (port >= 0) {
            return port;
        }

        return false;
    }
}
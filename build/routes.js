"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./components/user/controller");
function registerRoutes(app) {
    app.get('/', (req, res) => {
        const now = new Date();
        return res.status(200).send(now);
    });
    new controller_1.UserApi().register(app);
}
exports.registerRoutes = registerRoutes;

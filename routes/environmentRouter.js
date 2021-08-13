import Router from "./router.js";
import EnvironmentController from "../controllers/environmentController.js";

export default class EnvironmentRouter extends Router {
    constructor(app) {
        super(app);
        this.controller = new EnvironmentController();
    }
    
    get root() {
        return "/environment";
    }

    setupRoutes(router) {
        router.post('/:name', (req, res) => this.controller.createEnvironment(req, res));
        router.post('/isolated/:name', (req, res) => this.controller.createIsolatedEnvironment(req, res));
        router.delete('/:name', (req, res) => this.controller.deleteEnvironment(req, res));
    }
}
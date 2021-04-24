import Router from "./router.js";
import WebHookController from "../controllers/webhookController.js";

export default class WebHookRouter extends Router {
    constructor(app) {
        super(app);
        this.webHookController = new WebHookController();
    }

    get root() {
        return "/webhook";
    }

    setupRoutes(router) {
        router.post('/', (req, res) => this.webHookController.webhookPosted(req, res));
    }
}
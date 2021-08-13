import Router from "./router.js";

export default class HealthRouter extends Router {
    get root() {
        return "/health";        
    }

    doHealth(req, res) {
        const message = "Health check ok";
        console.log(message);
        res.status(200).send(message);
    }

    setupRoutes(router) {
        router.get("/", this.doHealth);
    }
}
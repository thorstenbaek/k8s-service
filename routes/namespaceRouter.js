import Router from "./router.js";
import NamespaceController from "../controllers/namespaceController.js";

export default class NamespaceRouter extends Router {
    constructor(app) {
        super(app);
        this.controller = new NamespaceController();
    }
    
    get root() {
        return "/namespace";
    }

    setupRoutes(router) {        
        router.get('/', (req, res) => this.controller.listNamespace(req, res));
        router.post('/:name', (req, res) => this.controller.createNamespace(req, res));
        router.get('/:name', (req, res) => this.controller.getNamespace(req, res));
        router.put('/:name', (req, res) => this.controller.updateNamespace(req, res));
        router.delete('/:name', (req, res) => this.controller.deleteNamespace(req, res));
    }
}
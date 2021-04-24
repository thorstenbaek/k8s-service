import express from "express";

export default class Router {
    constructor(app) {
        if (!app) {
            throw new Error("Missing router parameter");
        }        
        this.app = app;        
        this.router = express.Router();        
        this.registerRoutes();
    }
    
    get root() {
        return "/";
    }

    setupRoutes() {    
    }

    registerRoutes() {
        this.setupRoutes(this.router);
        this.app.use(this.root, this.router);
    }
}